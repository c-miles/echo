import { Message } from "../models/Message.js";
import { Room } from "../models/Room.js";

export const socketEvents = (io) => {
  // Track socket to room/user mapping for cleanup
  const socketToRoom = new Map();
  const socketToUser = new Map();

  io.on("connection", (socket) => {

    socket.on("disconnect", async () => {
      const roomId = socketToRoom.get(socket.id);
      const userId = socketToUser.get(socket.id);

      if (roomId && userId) {
        // Remove user from room in database
        try {
          const room = await Room.findById(roomId);
          if (room) {
            room.participants = room.participants.filter(
              (p) => p.userId !== userId
            );
            await room.save();

            // Notify other users in room
            socket.to(roomId).emit("userLeft", { userId });
          }
        } catch (error) {
          console.error("Error handling disconnect:", error);
        }

        // Cleanup maps
        socketToRoom.delete(socket.id);
        socketToUser.delete(socket.id);
      }
    });

    socket.on("joinRoom", async ({ roomId, userId, username, profilePicture }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Check room capacity
        const activeParticipants = room.participants.filter(p => p.isActive);
        if (activeParticipants.length >= room.maxParticipants) {
          socket.emit("error", { message: "Room is full" });
          return;
        }

        // Add user to room
        const newParticipant = {
          userId,
          socketId: socket.id,
          username,
          profilePicture,
          isActive: true,
          mediaState: { video: false, audio: true }  // Match client's initial state
        };

        // Check if user already exists (reconnecting)
        const existingIndex = room.participants.findIndex(p => p.userId === userId);
        if (existingIndex !== -1) {
          room.participants[existingIndex] = { ...room.participants[existingIndex], ...newParticipant };
        } else {
          room.participants.push(newParticipant);
        }

        await room.save();

        // Track socket associations
        socketToRoom.set(socket.id, roomId);
        socketToUser.set(socket.id, userId);

        // Join socket room
        socket.join(roomId);

        // Send current participants to new user
        const otherParticipants = room.participants
          .filter(p => p.userId !== userId && p.isActive)
          .map(p => ({
            userId: p.userId,
            username: p.username,
            profilePicture: p.profilePicture,
            mediaState: p.mediaState
          }));

        socket.emit("currentParticipants", otherParticipants);

        // Notify others of new user
        socket.to(roomId).emit("userJoined", {
          userId,
          username,
          profilePicture,
          mediaState: { video: false, audio: true }  // Match client's initial state
        });

        // Send existing messages
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        socket.emit("roomMessages", messages);

      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("getRoomMessages", async ({ roomId }) => {
      try {
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        socket.emit("roomMessages", messages);
      } catch (error) {
        console.error("Error fetching room messages:", error);
      }
    });

    socket.on("sendMessage", async ({ message, roomId, username }) => {
      try {
        const newMessage = new Message({ message, roomId, username });
        await newMessage.save();
        io.to(roomId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("toggleVideo", async ({ roomId, userId, videoEnabled }) => {
      try {
        // Update database
        const room = await Room.findById(roomId);
        if (room) {
          const participant = room.participants.find(p => p.userId === userId);
          if (participant) {
            participant.mediaState.video = videoEnabled;
            await room.save();
          }
        }

        // Broadcast to others
        socket.to(roomId).emit("participantVideoToggled", { userId, videoEnabled });
      } catch (error) {
        console.error("Error toggling video:", error);
      }
    });

    socket.on("toggleAudio", async ({ roomId, userId, audioEnabled }) => {
      try {
        // Update database
        const room = await Room.findById(roomId);
        if (room) {
          const participant = room.participants.find(p => p.userId === userId);
          if (participant) {
            participant.mediaState.audio = audioEnabled;
            await room.save();
          }
        }

        // Broadcast to others
        socket.to(roomId).emit("participantAudioToggled", { userId, audioEnabled });
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    });

    // WebRTC Signaling - Targeted peer-to-peer communication
    socket.on("sendOffer", ({ targetUserId, offer, fromUserId }) => {
      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        // Find target user's socket
        const targetSocket = [...socketToRoom.entries()]
          .find(([socketId, room]) => room === roomId && socketToUser.get(socketId) === targetUserId);

        if (targetSocket) {
          io.to(targetSocket[0]).emit("receiveOffer", {
            offer,
            fromUserId
          });
        }
      }
    });

    socket.on("sendAnswer", ({ targetUserId, answer, fromUserId }) => {
      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        // Find target user's socket
        const targetSocket = [...socketToRoom.entries()]
          .find(([socketId, room]) => room === roomId && socketToUser.get(socketId) === targetUserId);

        if (targetSocket) {
          io.to(targetSocket[0]).emit("receiveAnswer", {
            answer,
            fromUserId
          });
        }
      }
    });

    socket.on("sendIceCandidate", ({ targetUserId, candidate, fromUserId }) => {
      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        // Find target user's socket
        const targetSocket = [...socketToRoom.entries()]
          .find(([socketId, room]) => room === roomId && socketToUser.get(socketId) === targetUserId);

        if (targetSocket) {
          io.to(targetSocket[0]).emit("receiveIceCandidate", {
            candidate,
            fromUserId
          });
        }
      }
    });

    socket.on("leaveRoom", async ({ roomId, userId }) => {
      try {
        // Remove from database
        const room = await Room.findById(roomId);
        if (room) {
          const participant = room.participants.find(p => p.userId === userId);
          if (participant) {
            participant.isActive = false;
            await room.save();
          }
        }

        // Leave socket room
        socket.leave(roomId);
        
        // Notify others
        socket.to(roomId).emit("userLeft", { userId });

        // Cleanup maps
        socketToRoom.delete(socket.id);
        socketToUser.delete(socket.id);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    });
  });
};