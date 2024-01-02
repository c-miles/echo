import React from "react";
import Echo from "./Echo";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function EchoChamber() {
  const [roomId, setRoomId] = React.useState(null);
  const [stream, setStream] = React.useState(null);

  const localVideoRef = React.useRef();
  const remoteVideoRef = React.useRef();

  const [meetingId, setMeetingID] = React.useState();

  //TODO: Implement user authentication system
  const userId = Math.random().toString(36).substring(2, 15);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
      });
  }, []);

  React.useEffect(() => {
    if (roomId && localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [roomId, stream]);

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

  const createRoom = () => {
    fetch("http://localhost:3000/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRoomId(data.roomId);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  return React.createElement(Echo, {
    createRoom,
    localVideoRef,
    remoteVideoRef,
    roomId,
    stream,
  });
}
