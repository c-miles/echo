import React, { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";
import { DashboardProps } from "./types";
import AuthenticationButton from "../AuthenticationButton";

const Dashboard: React.FC<DashboardProps> = ({
  handleGoToRooms,
  handleUsernameSubmit,
  newUsername,
  setNewUsername,
  userInfo,
}) => {
  const styles = useStyles();

  return (
    <div style={styles.container}>
      {userInfo === null ? (
        <BeatLoader color="#09f" style={styles.spinner} />
      ) : !userInfo.username ? (
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          <button type="submit">Set Username</button>
        </form>
      ) : (
        <>
          <h2>Welcome to your Dashboard</h2>
          <img src={userInfo.picture} width={200} height={200} alt="User" />
          <button onClick={handleGoToRooms}>Go To Your Rooms</button>
          <AuthenticationButton />
        </>
      )}
    </div>
  );
};

export default Dashboard;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    marginTop: "50%",
  },
});
