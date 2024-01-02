import React from "react";

function Stream({ createRoom, localVideoRef, remoteVideoRef, roomId, stream }) {
  return (
    <div>
      {roomId ? (
        <video ref={localVideoRef} autoPlay muted playsInline />
      ) : (
        <button onClick={createRoom}>Start Room</button>
      )}

      {/* <video ref={localVideoRef} autoPlay muted playsInline />
      {stream && <video ref={remoteVideoRef} autoPlay playsInline />} */}
    </div>
  );
}

export default Stream;
