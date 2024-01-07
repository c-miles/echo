import React, { useEffect, RefObject, CSSProperties } from "react";

type RoomProps = {
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteVideoRef: RefObject<HTMLVideoElement>;
  remoteStream: MediaStream | null;
};

const Room: React.FC<RoomProps> = ({
  localVideoRef,
  remoteVideoRef,
  remoteStream,
}) => {
  const videoContainerStyle: CSSProperties = {
    display: "flex",
    justifyContent:
      remoteStream && remoteStream.active ? "space-evenly" : "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  };

  const videoStyle: CSSProperties = {
    width: "400px",
    height: "300px",
    objectFit: "cover",
  };

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream?.active) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current
        .play()
        .catch((e) => console.error("Error playing remote video:", e));
    }
  }, [remoteVideoRef, remoteStream]);

  return (
    <div style={videoContainerStyle}>
      <video
        ref={localVideoRef}
        style={videoStyle}
        autoPlay
        muted
        playsInline
      />
      {remoteStream?.active && (
        <video ref={remoteVideoRef} style={videoStyle} autoPlay playsInline />
      )}
    </div>
  );
};

export default Room;
