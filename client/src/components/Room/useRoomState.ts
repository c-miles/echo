import { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";

interface LocationState {
  isHost?: boolean;
}

export default function useRoomState() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  const isHost = state?.isHost || false;

  // TODO: Switch this to user's auth0 id
  const userIdRef = useRef<string>(Math.random().toString(36).substring(2, 15));

  return { roomId, isHost, userIdRef };
}
