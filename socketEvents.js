import { Room } from './Room.js';

export const socketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    // NOTE: Delete this after initial config is complete 
    socket.on("sendMessage", (msg) => {
      console.log("Received message:", msg);
      io.emit("receiveMessage", msg);
    });

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

// export default socketEvents;
