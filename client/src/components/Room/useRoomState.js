import React from "react";
import { useLocation, useParams } from "react-router-dom";

export default function useRoomState() {
  const { roomId } = useParams();
  const location = useLocation();
  const isHost = location.state?.isHost || false;
  const userIdRef = React.useRef(Math.random().toString(36).substring(2, 15));

  return { roomId, isHost, userIdRef };
}
