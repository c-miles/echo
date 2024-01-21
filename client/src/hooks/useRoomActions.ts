import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useRoomActions = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    fetch("http://localhost:3000/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: { roomId: string; pin: string }) => {
        console.log(data.pin); // TODO: remove me when pin is accessible
        navigate(`/room/${data.roomId}`, {
          state: { isHost: true, pin: data.pin },
        });
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  const joinRoom = useCallback(
    (pin: string) => {
      fetch(`http://localhost:3000/rooms/find-by-pin/${pin}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.roomId) {
            navigate(`/room/${data.roomId}`);
          } else {
            // Handle case where no room is found
          }
        })
        .catch((error) => {
          console.error("Error joining room:", error);
        });
    },
    [navigate]
  );

  return { createRoom, joinRoom };
};

export default useRoomActions;
