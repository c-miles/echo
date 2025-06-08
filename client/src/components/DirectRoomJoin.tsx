import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { Typography, Box } from "@mui/material";

import useAuthUser from "../hooks/useAuthUser";
import { isValidRoomNameFormat } from "../utils/roomNameGenerator";
import RoomContainer from "./Room";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DirectRoomJoin: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuthUser();
  const [error, setError] = useState<string | null>(null);
  const [shouldRenderRoom, setShouldRenderRoom] = useState(false);

  // Check if this is a direct room navigation from Dashboard (has state)
  const hasState = location.state && (location.state as any).isHost !== undefined;

  useEffect(() => {
    const handleRoomJoin = async () => {
      // If this navigation came from Dashboard (has state), render room directly
      if (hasState) {
        setShouldRenderRoom(true);
        return;
      }

      // This is a direct link access, need to handle authentication and resolution
      // Wait for auth to be determined
      if (userInfo === null) return;

      // If not authenticated, redirect to login with return URL
      if (!userInfo) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/api/auth/login?returnTo=${returnUrl}`;
        return;
      }

      // Validate room ID format
      if (!roomId) {
        setError("Invalid room link");
        return;
      }

      try {
        // Check if it's a friendly name (adjective-color-word) or MongoDB ObjectId
        if (isValidRoomNameFormat(roomId)) {
          // It's a friendly name, resolve to actual room ID and get friendly name
          const response = await fetch(`${API_BASE_URL}/rooms/find-by-name/${roomId}`);
          if (!response.ok) {
            setError("Room not found or has expired");
            return;
          }
          const data = await response.json();
          
          // Update location state with room info and render room
          navigate(`/room/${data.roomId}`, {
            state: { isHost: false, fromDirectLink: true, friendlyName: data.friendlyName },
            replace: true
          });
        } else {
          // It's a direct room ID, just render the room
          setShouldRenderRoom(true);
        }
      } catch (err) {
        console.error("Error joining room:", err);
        setError("Unable to join room. Please try again.");
      }
    };

    handleRoomJoin();
  }, [roomId, userInfo, navigate, hasState]);

  // Render the actual room if we should
  if (shouldRenderRoom) {
    return <RoomContainer />;
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        gap={2}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The room may have ended or the link might be invalid.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <BeatLoader color="#09f" />
      <Typography variant="h6">
        {userInfo === null ? "Checking authentication..." : "Joining room..."}
      </Typography>
    </Box>
  );
};

export default DirectRoomJoin;