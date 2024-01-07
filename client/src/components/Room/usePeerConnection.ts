import { useEffect, useRef } from "react";

const peerConnectionConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function usePeerConnection() {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    peerConnectionRef.current = new RTCPeerConnection(peerConnectionConfig);

    return () => {
      peerConnectionRef.current?.close();
    };
  }, []);

  return { peerConnectionRef };
}
