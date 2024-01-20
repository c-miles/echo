import React, { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";
import { DashboardProps } from "./types";

import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { VideoCall, MeetingRoom } from "@mui/icons-material";

const Dashboard: React.FC<DashboardProps> = ({
  handleGoToRooms,
  handleUsernameSubmit,
  newUsername,
  setNewUsername,
  userInfo,
}) => {
  const styles = useStyles();

  const isFormVisible = !userInfo?.username;

  return (
    <div style={styles.container}>
      {isFormVisible && <div style={styles.overlay}></div>}
      {userInfo === null ? (
        <BeatLoader color="#09f" style={styles.spinner} />
      ) : !userInfo.username ? (
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
                onClick={handleGoToRooms}
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
              <Button variant="contained" style={styles.button}>
                <MeetingRoom style={styles.icon} />
              </Button>
              <Typography>Join</Typography>
            </Box>
          </Box>
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  spinner: {
    marginTop: "50%",
  },
  textField: {
    width: 300,
  },
});
