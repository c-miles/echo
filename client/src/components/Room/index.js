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

  const [readyForIce, setReadyForIce] = React.useState();
  const [stream, setStream] = React.useState(null);
  const [streamReady, setStreamReady] = React.useState(false);

  const localVideoRef = React.useRef();
  const peerConnectionRef = React.useRef(null);
  const remoteVideoRef = React.useRef();

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
        setStreamReady(true);
      });
  }, []);

  React.useEffect(() => {
    if (localVideoRef.current && streamReady) {
      localVideoRef.current.srcObject = stream;
    }
  }, [streamReady]);

  React.useEffect(() => {
    socket && socket.emit("joinRoom", roomId);
  }, [socket]);

  React.useEffect(() => {
    if (streamReady) {
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

      let bufferedIceCandidates = [];

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          if (readyForIce) {
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate: event.candidate,
            });
          } else {
            bufferedIceCandidates.push(event.candidate);
          }
        }
      };

      socket.on("peerReadyForIce", ({ userId }) => {
        if (userId !== userIdRef.current && bufferedIceCandidates.length > 0) {
          bufferedIceCandidates.forEach((candidate) => {
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate,
            });
          });
          bufferedIceCandidates = [];
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
      if (isHost) {
        peerConnectionRef.current.createOffer().then(async (offer) => {
          await peerConnectionRef.current.setLocalDescription(offer);
          // Send offer to the server
          socket.emit("sendOffer", {
            roomId,
            userId: userIdRef.current,
            sdp: offer.sdp,
          });
        });

        socket.on("receiveAnswer", async ({ sdp }) => {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription({ type: "answer", sdp })
          );
          socket.emit("readyForIce", { roomId, userId: userIdRef.current });
        });
      } else if (!isHost) {
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
    }
  }, [streamReady]);

  return React.createElement(Room, {
    localVideoRef,
    remoteVideoRef,
    stream,
  });
}
