import React from "react";
import Room from "./Room";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function RoomContainer() {
  const [stream, setStream] = React.useState(null);
  const [host, setHost] = React.useState(false);

  const localVideoRef = React.useRef();
  const remoteVideoRef = React.useRef();

  const userId = Math.random().toString(36).substring(2, 15);

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
          // Send candidate to the other peer
        }
      };

      // Create offer
      peerConnection
        .createOffer()
        .then((offer) => {
          return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
          // Send offer to the other peer
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
    host,
    localVideoRef,
    remoteVideoRef,
    stream,
  });
}
