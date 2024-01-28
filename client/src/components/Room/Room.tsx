import React, { CSSProperties, useEffect, useState } from "react";

import { Box } from "@mui/material";

import ControlBar from "../ControlBar";
import MessageThread from "../MessageThread";
import { RoomProps } from "../../types/roomTypes";

const Room: React.FC<RoomProps> = ({
  localVideoRef,
  remoteStream,
  remoteVideoRef,
  roomId,
  userId,
  username,
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
    <Box
      sx={{
        ...styles.container,
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
      <Box sx={styles.threadContainer}>
        {isMessageThreadOpen && (
          <MessageThread roomId={roomId} userId={userId} username={username} />
        )}
      </Box>
      <ControlBar toggleMessageThread={toggleMessageThread} />
    </Box>
  );
};

export default Room;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    height: "calc(100vh - 64px)",
  },
  threadContainer: {
    position: "absolute",
    bottom: 40, // NOTE: height of ControlBar
    right: 0,
  },
  videoStyle: {
    width: "400px",
    height: "300px",
    objectFit: "cover",
  },
});
