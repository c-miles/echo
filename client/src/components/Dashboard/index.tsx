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

  const fetchedUserData = useRef(false);

  const createUser = useCallback(() => {
    if (!authUser) {
      return;
    }

    fetch("http://localhost:3000/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authUser.email,
        picture: authUser.picture,
        id: authUser.sub,
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

    fetch(`http://localhost:3000/user/${authUser.sub}`)
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

      fetch(`http://localhost:3000/user/${userInfo.id}`, {
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

  useEffect(() => {
    if (!userInfo && authUser && !isLoading && !fetchedUserData.current) {
      getUserData();
      fetchedUserData.current = true;
    }
  }, [getUserData, authUser, userInfo, isLoading]);

  const createRoom = () => {
    fetch("http://localhost:3000/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: { roomId: string; pin: string }) => {
        console.log(data.pin); // TODO: remove me when pin is accessible
        navigate(`/room/${data.roomId}`, {
          state: { isHost: true, pin: data.pin },
        });
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  const handleJoinRoom = useCallback(
    (pin: string) => {
      fetch(`http://localhost:3000/rooms/find-by-pin/${pin}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.roomId) {
            navigate(`/room/${data.roomId}`);
          } else {
            // Handle case where no room is found
          }
        })
        .catch((error) => {
          console.error("Error joining room:", error);
        });
    },
    [navigate]
  );

  return (
    <Dashboard
      createRoom={createRoom}
      handleJoinRoom={handleJoinRoom}
      handleUsernameSubmit={handleUsernameSubmit}
      newUsername={newUsername}
      setNewUsername={setNewUsername}
      userInfo={userInfo}
    />
  );
};

export default DashboardContainer;
