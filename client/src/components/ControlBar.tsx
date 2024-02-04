import React, { useState, CSSProperties } from "react";

import { IconButton, AppBar } from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

import { ControlBarProps } from "../types/controlBarTypes";

const ControlBar: React.FC<ControlBarProps> = ({
  audioEnabled,
  toggleAudio,
  toggleMessageThread,
  toggleVideo,
  videoEnabled,
}) => {
  const styles = useControlBarStyles();

  const [isMessageThreadOpen, setIsMessageThreadOpen] = useState(false);

  const handleChevronClick = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
    toggleMessageThread();
  };

  return (
    <AppBar position="static" style={styles.container}>
      <IconButton onClick={toggleVideo}>
        {videoEnabled ? (
          <Videocam style={styles.icon} />
        ) : (
          <VideocamOff style={styles.icon} />
        )}
      </IconButton>
      <IconButton onClick={toggleAudio}>
        {audioEnabled ? (
          <Mic style={styles.icon} />
        ) : (
          <MicOff style={styles.icon} />
        )}
      </IconButton>
      <IconButton onClick={handleChevronClick} style={styles.threadContainer}>
        {isMessageThreadOpen ? (
          <KeyboardArrowDown style={styles.icon} />
        ) : (
          <KeyboardArrowUp style={styles.icon} />
        )}
      </IconButton>
    </AppBar>
  );
};

export default ControlBar;

const useControlBarStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    backgroundColor: "#424242",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    position: "fixed",
  },
  threadContainer: {
    position: "absolute",
    right: "2%",
  },
  icon: {
    color: "white",
  },
});
