import React, { CSSProperties, useEffect, useState } from "react";

import ControlBar from "../ControlBar";
import MessageThread from "../MessageThread";
import { RoomProps } from "../../types/roomTypes";

const Room: React.FC<RoomProps> = ({
  localVideoRef,
  remoteStream,
  remoteVideoRef,
  roomId,
  userId,
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

  const [isMessageThreadOpen, setIsMessageThreadOpen] = useState(false);

  const toggleMessageThread = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
  };

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
        <video
          ref={remoteVideoRef}
          style={styles.videoStyle}
          autoPlay
          playsInline
        />
      )}
      {isMessageThreadOpen && <MessageThread roomId={roomId} userId={userId} />}
      <ControlBar toggleMessageThread={toggleMessageThread} />
    </div>
  );
};

export default Room;

const useStyles = (): { [key: string]: CSSProperties } => ({
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
