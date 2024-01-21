import React, { useState } from "react";

import useAuthUser from "../../hooks/useAuthUser";
import useRoomActions from "../../hooks/useRoomActions";

import Dashboard from "./Dashboard";

const DashboardContainer: React.FC = () => {
  const { userInfo, handleUsernameUpdate } = useAuthUser();
  const { createRoom, joinRoom } = useRoomActions();

  const [newUsername, setNewUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = await handleUsernameUpdate(newUsername);
    setUsernameError(error);
  };

  return (
    <Dashboard
      createRoom={createRoom}
      handleJoinRoom={joinRoom}
      handleUsernameSubmit={handleUsernameSubmit}
      newUsername={newUsername}
      setNewUsername={setNewUsername}
      usernameError={usernameError}
      userInfo={userInfo}
    />
  );
};

export default DashboardContainer;
