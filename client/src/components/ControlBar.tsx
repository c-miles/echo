import React, { useState, CSSProperties } from "react";

import { IconButton, AppBar, Chip } from "@mui/material";
import {
  ExitToApp,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Mic,
  MicOff,
  People,
  Share,
  Videocam,
  VideocamOff,
} from "@mui/icons-material";

import { ControlBarProps } from "../types/controlBarTypes";

const ControlBar: React.FC<ControlBarProps> = ({
  audioEnabled,
  onLeaveRoom,
  onShareRoom,
  participantCount,
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
      <div style={styles.leftSection}>
        {participantCount && (
          <Chip
            icon={<People style={styles.chipIcon} />}
            label={participantCount}
            style={styles.participantChip}
            size="small"
          />
        )}
      </div>

      <div style={styles.centerSection}>
        <IconButton onClick={toggleVideo}>
          {videoEnabled ? (
            <Videocam style={styles.icon} />
          ) : (
            <VideocamOff style={styles.iconDisabled} />
          )}
        </IconButton>
        <IconButton onClick={toggleAudio}>
          {audioEnabled ? (
            <Mic style={styles.icon} />
          ) : (
            <MicOff style={styles.iconDisabled} />
          )}
        </IconButton>
        {onShareRoom && (
          <IconButton onClick={onShareRoom} style={styles.shareButton}>
            <Share style={styles.icon} />
          </IconButton>
        )}
        {onLeaveRoom && (
          <IconButton onClick={onLeaveRoom} style={styles.leaveButton}>
            <ExitToApp style={styles.leaveIcon} />
          </IconButton>
        )}
      </div>

      <div style={styles.rightSection}>
        <IconButton onClick={handleChevronClick}>
          {isMessageThreadOpen ? (
            <KeyboardArrowDown style={styles.icon} />
          ) : (
            <KeyboardArrowUp style={styles.icon} />
          )}
        </IconButton>
      </div>
    </AppBar>
  );
};

export default ControlBar;

const useControlBarStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    backgroundColor: "#2a2a2a",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    padding: "0.5rem 1rem",
    height: "80px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    minWidth: "150px",
  },
  centerSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    minWidth: "150px",
    justifyContent: "flex-end",
  },
  participantChip: {
    backgroundColor: "#3a3a3a",
    color: "white",
  },
  chipIcon: {
    color: "white",
  },
  icon: {
    color: "white",
  },
  iconDisabled: {
    color: "#ef5350",
  },
  shareButton: {
    marginLeft: "0.5rem",
    backgroundColor: "#1976d2",
  },
  leaveButton: {
    marginLeft: "0.5rem",
    backgroundColor: "#d32f2f",
  },
  leaveIcon: {
    color: "white",
  },
});