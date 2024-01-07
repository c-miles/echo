import React from "react";

export default function useMediaStream() {
  const [stream, setStream] = React.useState(null);
  const [streamReady, setStreamReady] = React.useState(false);
  const localVideoRef = React.useRef();

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

  return { stream, streamReady, localVideoRef };
}
