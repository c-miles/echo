import { useEffect, useState, useRef } from "react";
import { UseMediaStreamProps } from "../../types/mediaStreamTypes";

export default function useMediaStream(_props: UseMediaStreamProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [permissionError, setPermissionError] = useState<'denied' | 'notfound' | 'other' | null>(null);
  const [videoPermissionError, setVideoPermissionError] = useState<'denied' | 'notfound' | 'other' | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    
    // Request audio only initially  
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        setStream(mediaStream);
        setStreamReady(true);
        setPermissionError(null);
      })
      .catch((error) => {
        console.error("Error getting audio stream:", error);
        isInitialized.current = false;
        if (error.name === 'NotAllowedError') {
          setPermissionError('denied');
        } else if (error.name === 'NotFoundError') {
          setPermissionError('notfound');
        } else {
          setPermissionError('other');
        }
      });
// Error handling is now done in the catch blocks above

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
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        // Video track exists, just toggle it
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      } else if (!videoEnabled) {
        // No video track, request camera permission
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((videoStream) => {
            const newVideoTrack = videoStream.getVideoTracks()[0];
            if (newVideoTrack && streamRef.current) {
              streamRef.current.addTrack(newVideoTrack);
              setStream(streamRef.current);
              setVideoEnabled(true);
            }
          })
          .catch((error) => {
            console.error("Error getting video stream:", error);
            if (error.name === 'NotAllowedError') {
              setVideoPermissionError('denied');
            } else if (error.name === 'NotFoundError') {
              setVideoPermissionError('notfound');
            } else {
              setVideoPermissionError('other');
            }
          });
      }
    }
  };

  const retryMediaAccess = async () => {
    console.log("Retrying media access...");
    setPermissionError(null);
    setStreamReady(false);
    
    // Simple retry - just reload the page
    window.location.reload();
  };

  const retryVideoAccess = () => {
    setVideoPermissionError(null);
    // User can just try clicking the video button again
  };

  return {
    audioEnabled,
    localVideoRef,
    permissionError,
    retryMediaAccess,
    retryVideoAccess,
    setVideoPermissionError,
    stream,
    streamReady,
    toggleAudio,
    toggleVideo,
    videoEnabled,
    videoPermissionError,
  };
}
