import { Message } from "../models/Message.js";
import { Room } from "../models/Room.js";

export const socketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });

      socket.emit("roomMessages", messages);
    });

    socket.on("sendMessage", async ({ message, roomId, username }) => {
      const newMessage = new Message({ message, roomId, username });
      await newMessage.save();

      socket.to(roomId).emit("receiveMessage", newMessage);
    });

    socket.on(
      "toggleVideo",
      async ({ roomId, userId, userPicture, videoEnabled }) => {
        socket
          .to(roomId)
          .emit("videoToggled", { userId, userPicture, videoEnabled });
      }
    );

    socket.on("sendOffer", async ({ roomId, userId, sdp }) => {
      try {
        const room = await Room.findById(roomId);
        if (room) {
          const participantIndex = room.participants.findIndex(
            (p) => p.userId === userId
          );
          if (participantIndex !== -1) {
            // Update existing participant
            room.participants[participantIndex].sdp = sdp;
          } else {
            // Add new participant
            room.participants.push({ userId, sdp });
          }
          await room.save();

          io.to(roomId).emit("offerAvailable", { userId, sdp });
        }
      } catch (error) {
        console.error("Error saving offer:", error);
      }
    });

    socket.on("requestOffer", async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId).exec();
        if (room && room.participants.length > 0) {
          // Assuming the host is the first participant
          const hostSdp = room.participants[0].sdp;

          socket.emit("receiveOffer", { sdp: hostSdp });
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    });

    socket.on("sendAnswer", ({ roomId, sdp }) => {
      // Send the answer to the host
      socket.to(roomId).emit("receiveAnswer", { sdp });
    });

    socket.on("readyForIce", ({ roomId, userId }) => {
      socket.to(roomId).emit("peerReadyForIce", { userId });
    });

    socket.on("sendCandidate", ({ roomId, userId, candidate }) => {
      // Relay candidate to other participants in the room
      socket.to(roomId).emit("receiveCandidate", { userId, candidate });
    });
  });
};
