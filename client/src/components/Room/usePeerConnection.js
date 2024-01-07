import React from "react";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function usePeerConnection() {
  const peerConnectionRef = React.useRef(null);

  React.useEffect(() => {
    peerConnectionRef.current = new RTCPeerConnection(peerConnectionConfig);

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return { peerConnectionRef };
}
