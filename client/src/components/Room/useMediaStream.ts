import { useEffect, useState, useRef } from "react";

export default function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        setStreamReady(true);
      })
      .catch((error) => {
        console.error("Error getting media stream:", error);
      });
  }, []);

  useEffect(() => {
    if (localVideoRef.current && streamReady && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [streamReady, stream]);

  return { stream, streamReady, localVideoRef };
}
