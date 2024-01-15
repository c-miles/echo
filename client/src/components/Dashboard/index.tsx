import React, { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./Dashboard";
import { User } from "./types";

const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, user: authUser } = useAuth0();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const hasFetchedUserData = useRef(false);

  const createUser = useCallback(() => {
    if (!authUser) {
      return;
    }

    fetch("http://localhost:3000/create-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authUser.email,
        picture: authUser.picture,
      }),
    })
      .then((res) => res.json())
      .then((data) => setUserInfo(data as User))
      .catch((error) => console.error("Error creating user:", error));
  }, [authUser]);

  const getUserData = useCallback(() => {
    if (!authUser || userInfo) {
      return;
    }

    fetch(`http://localhost:3000/user/${authUser.email}`)
      .then((response) => {
        if (response.status === 404) {
          createUser();
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user data");
        }
      })
      .then((data) => {
        if (data) {
          setUserInfo(data as User);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [createUser, authUser, userInfo]);

  const handleUsernameSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!userInfo) {
        return;
      }

      fetch(`http://localhost:3000/user/${userInfo.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      })
        .then((response) => response.json())
        .then((data) => setUserInfo(data))
        .catch((error) => console.error("Error updating user data:", error));
    },
    [newUsername, userInfo]
  );

  const handleGoToRooms = () => {
    navigate("/rooms");
  };


  useEffect(() => {
    if (!userInfo && authUser && !isLoading && !hasFetchedUserData.current) {
      console.log("fetchUserData called");
      getUserData();
      hasFetchedUserData.current = true;
    }
  }, [getUserData, authUser, userInfo, isLoading]);

  return (
    <Dashboard
      handleGoToRooms={handleGoToRooms}
      handleUsernameSubmit={handleUsernameSubmit}
      newUsername={newUsername}
      setNewUsername={setNewUsername}
      userInfo={userInfo}
    />
  );
};

export default DashboardContainer;
