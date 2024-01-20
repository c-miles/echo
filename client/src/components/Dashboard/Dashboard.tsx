import React, { CSSProperties, useState } from "react";
import { BeatLoader } from "react-spinners";
import { DashboardProps } from "./types";

import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { Close, MeetingRoom, VideoCall } from "@mui/icons-material";

const Dashboard: React.FC<DashboardProps> = ({
  createRoom,
  handleJoinRoom,
  handleUsernameSubmit,
  newUsername,
  setNewUsername,
  userInfo,
}) => {
  const styles = useStyles();

  const showUsernameForm = !userInfo?.username;
  const [roomPin, setRoomPin] = useState("");
  const [showJoinRoomForm, setShowJoinRoomForm] = useState(false);

  const onJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoinRoom(roomPin);
  };

  return (
    <div style={styles.container}>
      {(showUsernameForm || showJoinRoomForm) && <div style={styles.overlay} />}

      {userInfo === null ? (
        <BeatLoader color="#09f" style={styles.spinner} />
      ) : showUsernameForm ? (
        <FormControl
          component="form"
          onSubmit={handleUsernameSubmit}
          style={styles.formControl}
        >
          <TextField
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Choose a username"
            required
            margin="normal"
            style={styles.textField}
          />
          <Button type="submit" variant="contained" color="primary">
            Set Username
          </Button>
        </FormControl>
      ) : (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" gap={20}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Button
                onClick={createRoom}
                variant="contained"
                style={styles.button}
              >
                <VideoCall style={styles.icon} />
              </Button>
              <Typography>New Room</Typography>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Button
                onClick={() => setShowJoinRoomForm(true)}
                variant="contained"
                style={styles.button}
              >
                <MeetingRoom style={styles.icon} />
              </Button>
              <Typography>Join</Typography>
            </Box>
          </Box>

          {showJoinRoomForm && (
            <div style={styles.modalStyle}>
              <Button
                onClick={() => setShowJoinRoomForm(false)}
                style={styles.closeButton}
              >
                <Close />
              </Button>
              <FormControl
                component="form"
                onSubmit={onJoinRoomSubmit}
                style={styles.formControl}
              >
                <TextField
                  type="text"
                  value={roomPin}
                  onChange={(e) => setRoomPin(e.target.value)}
                  placeholder="Enter Room PIN"
                  required
                  margin="normal"
                  style={styles.textField}
                />
                <Button type="submit" variant="contained" color="primary">
                  Join Room
                </Button>
              </FormControl>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    justifyContent: "center",
    position: "relative",
  },
  button: {
    width: 120,
    height: 120,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderRadius: "50%",
    color: "grey",
    cursor: "pointer",
    minWidth: "auto",
    padding: "10px",
    position: "absolute",
    right: 0,
    top: 0,
  },
  formControl: {
    textAlign: "center",
    zIndex: 2,
  },
  hidden: {
    display: "none",
  },
  icon: {
    fontSize: 70,
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
    padding: "50px",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 2,
  },
  spinner: {
    position: "absolute",
  },
  textField: {
    width: 300,
  },
});
