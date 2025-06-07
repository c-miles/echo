import { useEffect, useState, useRef } from "react";
import { UseMediaStreamProps } from "../../types/mediaStreamTypes";

export default function useMediaStream({
  roomId,
  socket,
  userPicture,
}: UseMediaStreamProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        setStream(mediaStream);
        setStreamReady(true);
      })
      .catch((error) => {
        console.error("Error getting media stream:", error);
        isInitialized.current = false; // Reset on error
      });

    // Cleanup function that only runs on actual unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (localVideoRef.current && streamReady && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [streamReady, stream]);

  // TODO: Validate functionality by testing on two machines when able/deployed
  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(audioTracks.some((track) => track.enabled));

      // TODO: Implement this in socketEvents server side, reflect in peer's UI
      // socket?.emit("audioToggled", {
      //   roomId,
      //   audioEnabled: audioTracks.some(track => track.enabled),
      // });
    }
  };

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

  return {
    audioEnabled,
    localVideoRef,
    stream,
    streamReady,
    toggleAudio,
    toggleVideo,
    videoEnabled,
  };
}
