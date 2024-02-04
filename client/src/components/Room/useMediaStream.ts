import { useEffect, useState, useRef } from "react";
import { UseMediaStreamProps } from "../../types/mediaStreamTypes";

export default function useMediaStream({
  roomId,
  socket,
  userPicture,
}: UseMediaStreamProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

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

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream
        .getTracks()
        .find((track) => track.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);

        socket?.emit("toggleVideo", {
          roomId,
          videoEnabled: videoTrack.enabled,
          userPicture,
        });
      }
    }
  };

  return { stream, streamReady, localVideoRef, toggleVideo, videoEnabled };
}
