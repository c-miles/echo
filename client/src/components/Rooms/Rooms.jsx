import React from "react";

function Rooms({ createRoom, joinRoom, rooms }) {
  console.log(rooms);
  return (
    <div>
      {rooms &&
        rooms.map((room, index) => (
          <button key={index} onClick={() => joinRoom(room._id)}>
            Join Echo Room {room.roomId}
          </button>
        ))}
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
}

export default Rooms;
