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
  toggleVideo,
  username,
  userPicture,
  videoEnabled,
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
        ...styles.container,
        justifyContent: remoteStream?.active ? "space-evenly" : "center",
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        ref={localVideoRef}
        style={{ ...styles.videoStyle, display: !videoEnabled ? "none" : "" }}
      />
      <Box style={{ flexGrow: 1, display: videoEnabled ? "none" : "" }}>
        <Box style={styles.imageContainer}>
          <img
            alt="Profile Pic"
            src={userPicture}
            style={styles.profileImage}
          />
        </Box>
      </Box>
      {remoteStream?.active && (
        <video
          autoPlay
          playsInline
          ref={remoteVideoRef}
          style={styles.videoStyle}
        />
      )}
      <Box sx={styles.threadContainer}>
        {isMessageThreadOpen && (
          <MessageThread roomId={roomId} username={username} />
        )}
      </Box>

      <ControlBar
        toggleMessageThread={toggleMessageThread}
        toggleVideo={toggleVideo}
        videoEnabled={videoEnabled}
      />
    </div>
  );
};

export default Room;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyItems: "center",
    boxSizing: "border-box",
    height: "calc(100vh - 64px)", // NOTE: height of Navbar
    margin: "0 auto",
    width: "100vw",
  },
  hidden: {
    display: "none",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  profileImage: {
    height: "300px",
    objectFit: "inherit",
    objectPosition: "center",
    width: "400px",
  },
  threadContainer: {
    bottom: -4,
    marginLeft: "auto",
    position: "relative",
  },
  videoStyle: {
    height: "300px",
    width: "400px",
    flexGrow: 1,
  },
});
