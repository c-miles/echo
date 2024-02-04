import { RefObject } from "react";

export type RoomProps = {
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteStream: MediaStream | null;
  remoteUserPicture: string | undefined;
  remoteVideoEnabled: boolean;
  remoteVideoRef: RefObject<HTMLVideoElement>;
  roomId: string | undefined;
  toggleVideo: () => void;
  username: string | undefined;
  userPicture: string | undefined;
  videoEnabled: boolean;
};
