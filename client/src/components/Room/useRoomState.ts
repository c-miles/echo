import { useRef, useState } from "react";
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

  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState<boolean>(true);
  const [remoteUserPicture, setRemoteUserPicture] = useState<
    string | undefined
  >(undefined);

  return {
    isHost,
    remoteUserPicture,
    remoteVideoEnabled,
    roomId,
    setRemoteUserPicture,
    setRemoteVideoEnabled,
    userIdRef,
  };
}
