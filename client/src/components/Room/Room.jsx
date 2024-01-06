import React from "react";

function Room({ localVideoRef, remoteVideoRef, stream }) {
  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline />
      {stream && <video ref={remoteVideoRef} autoPlay playsInline />}
    </div>
  );
}

export default Room;
