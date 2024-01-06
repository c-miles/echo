import React from "react";
import Rooms from "./Rooms";

import { useNavigate } from "react-router-dom";

export default function RoomsContainer() {
  const navigate = useNavigate();

  const [rooms, setRooms] = React.useState();

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
      .then((data) => {
        navigate(`/room/${data.roomId}`);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  const joinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return React.createElement(Rooms, { createRoom, joinRoom, rooms });
}
