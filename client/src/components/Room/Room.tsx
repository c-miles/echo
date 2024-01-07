import React, { RefObject } from "react";

type RoomProps = {
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteVideoRef: RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
};

const Room: React.FC<RoomProps> = ({ localVideoRef, remoteVideoRef, stream }) => {
  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      {stream && <video ref={remoteVideoRef} autoPlay playsInline />}
    </div>
  );
};

export default Room;
