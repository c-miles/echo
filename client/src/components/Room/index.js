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

  const [iceCandidatesBuffer, setIceCandidatesBuffer] = React.useState([]);
  const [readyForIce, setReadyForIce] = React.useState();

  const isHost = location.state?.isHost || false;
  const userIdRef = React.useRef(Math.random().toString(36).substring(2, 15));

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
    let peerConnection;
    if (stream) {
      peerConnection = new RTCPeerConnection(peerConnectionConfig);

      // Add stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Set up remote stream
      let remoteStream = new MediaStream();
      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          setIceCandidatesBuffer((prevCandidates) => [
            ...prevCandidates,
            event.candidate,
          ]);
        }
      };

      // Create offer
      if (isHost && stream) {
        peerConnection.createOffer().then((offer) => {
          peerConnection.setLocalDescription(offer).then(() => {
            // Send offer to the server
            socket.emit("sendOffer", {
              roomId,
              userId: userIdRef.current,
              sdp: offer.sdp,
            });
          });
        });
      }

      // socket.emit("readyForIce", { roomId });

      // Listen for the event indicating it's time to send ICE candidates
      socket.on("readyForIce", () => {
        // Emit buffered ICE candidates
        iceCandidatesBuffer.forEach((candidate) => {
          socket.emit("sendCandidate", {
            roomId,
            userId: userIdRef.current,
            candidate,
          });
        });
        // Clear the buffer
        setIceCandidatesBuffer([]);
      });

      // More logic for receiving answer and setting remote description...
    }

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [stream]);

  return React.createElement(Room, {
    localVideoRef,
    remoteVideoRef,
    stream,
  });
}
