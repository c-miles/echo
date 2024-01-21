import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthUser from "../../hooks/useAuthUser";
import Dashboard from "./Dashboard";

const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, handleUsernameUpdate } = useAuthUser();

  const [newUsername, setNewUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = await handleUsernameUpdate(newUsername);
    setUsernameError(error);
  };

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
      usernameError={usernameError}
      userInfo={userInfo}
    />
  );
};

export default DashboardContainer;
