import React from "react";
import Rooms from "./Rooms";
import { Room } from "./types";

import { useNavigate } from "react-router-dom";

export default function RoomsContainer() {
  const navigate = useNavigate();

  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/rooms")
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  const createRoom = () => {
    fetch("http://localhost:3000/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: { roomId: string }) => {
        navigate(`/room/${data.roomId}`, { state: { isHost: true } });
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  const joinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`, { state: { isHost: false } });
  };

  return <Rooms createRoom={createRoom} joinRoom={joinRoom} rooms={rooms} />;
}
