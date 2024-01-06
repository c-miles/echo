import React from "react";
import Room from "./Room";

import { useLocation, useParams } from "react-router-dom";

import useSocket from "../../services/useSocket";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// NOTE: Look into SFU's for scaling/multiple user streams

export default function RoomContainer() {
  const { roomId } = useParams();
  const location = useLocation();
  const socket = useSocket();

  const [stream, setStream] = React.useState(null);
  const localVideoRef = React.useRef();
  const remoteVideoRef = React.useRef();

  const peerConnectionRef = React.useRef(null);
  const [iceCandidatesBuffer, setIceCandidatesBuffer] = React.useState([]);
  const [readyForIce, setReadyForIce] = React.useState();

  const isHost = location.state?.isHost || false;
  const userIdRef = React.useRef(Math.random().toString(36).substring(2, 15));

  React.useEffect(() => {
    peerConnectionRef.current = new RTCPeerConnection(peerConnectionConfig);

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
      });
  }, []);

  React.useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  React.useEffect(() => {
    socket && socket.emit("joinRoom", roomId);
  }, [socket]);

  React.useEffect(() => {
    if (stream) {
      // socket && socket.emit("joinRoom", roomId);
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Set up remote stream
      let remoteStream = new MediaStream();
      peerConnectionRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          if (readyForIce) {
            // Directly send the candidate if already ready
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate: event.candidate,
            });
          } else {
            // Buffer the candidate if not yet ready
            setIceCandidatesBuffer((prevCandidates) => [
              ...prevCandidates,
              event.candidate,
            ]);
          }
        }
      };

      socket.on("peerReadyForIce", ({ userId }) => {
        if (userId !== userIdRef.current) {
          // The other peer is ready. Send buffered candidates.
          iceCandidatesBuffer.forEach((candidate) => {
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate,
            });
          });
          setIceCandidatesBuffer([]);
          setReadyForIce(true);
        }
      });

      socket.on("receiveCandidate", ({ userId, candidate }) => {
        if (userId !== userIdRef.current) {
          peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      });

      // Create offer
      if (isHost && stream) {
        peerConnectionRef.current.createOffer().then((offer) => {
          peerConnectionRef.current.setLocalDescription(offer).then(() => {
            // Send offer to the server
            socket.emit("sendOffer", {
              roomId,
              userId: userIdRef.current,
              sdp: offer.sdp,
            });
          });
        });

        socket.on("receiveAnswer", async ({ sdp }) => {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription({ type: "answer", sdp })
          );
          socket.emit("readyForIce", { roomId, userId: userIdRef.current });
        });
      } else if (!isHost && stream) {
        // Non-host requests the host's offer
        socket.emit("requestOffer", { roomId });

        socket.on("receiveOffer", async ({ sdp }) => {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp })
          );

          // Create an answer
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("sendAnswer", {
            roomId,
            userId: userIdRef.current,
            sdp: answer.sdp,
          });

          socket.emit("readyForIce", { roomId, userId: userIdRef.current });
        });
      }

      socket.on("readyForIce", () => {
        iceCandidatesBuffer.forEach((candidate) => {
          socket.emit("sendCandidate", {
            roomId,
            userId: userIdRef.current,
            candidate,
          });
        });
        setIceCandidatesBuffer([]);
      });
    }
  }, [stream]);

  return React.createElement(Room, {
    localVideoRef,
    remoteVideoRef,
    stream,
  });
}
