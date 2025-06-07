import React, { CSSProperties, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

import ControlBar from "../ControlBar";
import MessageThread from "../MessageThread";
import VideoGrid from "./VideoGrid";
import { Participant } from "./useRoomState";

interface RoomProps {
  audioEnabled: boolean;
  localStream: MediaStream | null;
  localUserId: string;
  localUsername: string;
  localVideoEnabled: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  participants: Map<string, Participant>;
  profilePicture?: string;
  roomId: string | undefined;
  roomError: string | null;
  isConnecting: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  onLeaveRoom: () => void;
  username?: string;
  socket: any; // Add socket prop
}

const Room: React.FC<RoomProps> = ({
  audioEnabled,
  localStream,
  localUserId,
  localUsername,
  localVideoEnabled,
  localVideoRef,
  participants,
  profilePicture,
  roomId,
  roomError,
  isConnecting,
  toggleAudio,
  toggleVideo,
  onLeaveRoom,
  username,
  socket,
}) => {
  const styles = useStyles();
  const [isMessageThreadOpen, setIsMessageThreadOpen] = useState(false);

  const toggleMessageThread = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
  };

  // Show error state
  if (roomError) {
    return (
      <Box style={styles.container}>
        <Alert severity="error" style={styles.alert}>
          <Typography variant="h6">Unable to join room</Typography>
          <Typography>{roomError}</Typography>
        </Alert>
      </Box>
    );
  }

  // Show loading state
  if (isConnecting) {
    return (
      <Box style={styles.loadingContainer}>
        <CircularProgress size={60} />
        <Typography variant="h6" style={styles.loadingText}>
          Connecting to room...
        </Typography>
      </Box>
    );
  }

  return (
    <div style={styles.container}>
      <Box style={styles.videoGridContainer}>
        <VideoGrid
          localStream={localStream}
          localUserId={localUserId}
          localUsername={localUsername}
          localVideoEnabled={localVideoEnabled}
          localAudioEnabled={audioEnabled}
          participants={participants}
          profilePicture={profilePicture}
        />
      </Box>

      {/* Hidden video element for local stream initialization */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />

      <Box sx={styles.threadContainer}>
        {isMessageThreadOpen && roomId && (
          <MessageThread roomId={roomId} username={username || localUsername} socket={socket} />
        )}
      </Box>

      <ControlBar
        audioEnabled={audioEnabled}
        toggleAudio={toggleAudio}
        toggleMessageThread={toggleMessageThread}
        toggleVideo={toggleVideo}
        videoEnabled={localVideoEnabled}
        onLeaveRoom={onLeaveRoom}
        participantCount={participants.size + 1}
      />
    </div>
  );
};

export default Room;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)", // NOTE: height of Navbar
    width: "100vw",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 64px)",
    backgroundColor: "#1a1a1a",
    gap: "1.5rem",
  },
  loadingText: {
    color: "#fff",
    marginTop: "1rem",
  },
  videoGridContainer: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  threadContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 80, // Height of control bar
    zIndex: 10,
  },
  alert: {
    maxWidth: "500px",
    margin: "auto",
  },
});