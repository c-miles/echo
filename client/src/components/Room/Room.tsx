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
          <MessageThread roomId={roomId} username={username} />
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
    height: "calc(100vh - 64px)", // NOTE: height of Navbar
    justifyContent: "flex-start",
  },
  threadContainer: {
    bottom: -4,
    marginLeft: "auto",
    position: "relative",
  },
  videoStyle: {
    flexGrow: 1,
    height: "300px",
    width: "400px",
  },
});
