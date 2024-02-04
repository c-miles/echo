import { Socket } from "socket.io-client";

export interface UseMediaStreamProps {
  roomId: string | undefined;
  socket: Socket | null;
  userPicture: string | undefined;
}
