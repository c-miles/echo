import React, { CSSProperties, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import AuthenticationButton from "./AuthenticationButton";

interface User {
  createdAt: Date;
  email: string;
  picture: string;
  username?: string;
  usernameSet: boolean;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const styles = useStyles();
  // const [isUsernameSet, setIsUsernameSet] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const [goober, setGoober] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response = await fetch(`http://localhost:3000/user/${user?.email}`);

        if (response.status === 404) {
          response = await fetch("http://localhost:3000/create-user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
              picture: user?.picture,
            }),
          });
        }
        const data = await response.json();
        setGoober(data as User);
        // setIsUsernameSet(data.usernameSet);
      } catch (error) {
        console.error("Error fetching/creating user data:", error);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, isLoading]);

  const handleGoToRooms = () => {
    navigate("/rooms");
  };

  return (
    <div style={styles.container}>
      <h2>Welcome to your Dashboard</h2>
      {!isLoading && (
        <img src={`${goober?.picture}`} width={200} height={200} alt="User" />
      )}
      <button onClick={handleGoToRooms}>Go To Your Rooms</button>
      <AuthenticationButton />
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
});
