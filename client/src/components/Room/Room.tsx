import React, { CSSProperties, useEffect, RefObject } from "react";

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
  const styles = useStyles();

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream?.active) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current
        .play()
        .catch((e) => console.error("Error playing remote video:", e));
    }
  }, [remoteVideoRef, remoteStream]);

  return (
    <div
      style={{
        ...styles.videoContainerStyle,
        justifyContent: remoteStream?.active ? "space-evenly" : "center",
      }}
    >
      <video
        ref={localVideoRef}
        style={styles.videoStyle}
        autoPlay
        muted
        playsInline
      />
      {remoteStream?.active && (
        <video ref={remoteVideoRef} style={styles.videoStyle} autoPlay playsInline />
      )}
    </div>
  );
};

export default Room;

const useStyles = (): { [key: string]: React.CSSProperties } => ({
  videoContainerStyle: {
    display: "flex",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  videoStyle: {
    width: "400px",
    height: "300px",
    objectFit: "cover",
  },
});
