import React, { useEffect, useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Room from "./Room";

import useAuthUser from "../../hooks/useAuthUser";
import useMediaStream from "./useMediaStream";
import usePeerConnection from "./usePeerConnection";
import useRoomState from "./useRoomState";
import useSocket from "../../services/useSocket";

interface LocationState {
  isHost?: boolean;
  friendlyName?: string;
}

const RoomContainer: React.FC = () => {
  const { userInfo } = useAuthUser();
  const socket = useSocket();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [roomName] = useState<string | undefined>(state?.friendlyName);

  const {
    roomId,
    userIdRef,
    usernameRef,
    participants,
    roomError,
    isConnecting,
    setRoomError,
    setIsConnecting,
    addParticipant,
    removeParticipant,
    updateParticipantMediaState,
    updateParticipantStream,
    updateParticipantConnectionState,
    setMultipleParticipants,
  } = useRoomState(userInfo?.username);

  // Callbacks for peer connection events
  const handleStreamAdded = useCallback((userId: string, stream: MediaStream) => {
    console.log(`Stream added for user ${userId}`);
    updateParticipantStream(userId, stream);
  }, [updateParticipantStream]);

  const handleStreamRemoved = useCallback((userId: string) => {
    console.log(`Stream removed for user ${userId}`);
    const participant = participants.get(userId);
    if (participant) {
      updateParticipantStream(userId, undefined);
    }
  }, [participants, updateParticipantStream]);

  const handleConnectionStateChange = useCallback((userId: string, state: RTCPeerConnectionState) => {
    console.log(`Connection state changed for ${userId}: ${state}`);
    updateParticipantConnectionState(userId, state);
  }, [updateParticipantConnectionState]);

  const {
    setLocalStream,
    connectToPeer,
    connectToMultiplePeers,
    disconnectFromPeer,
    toggleVideo: togglePeerVideo,
    toggleAudio: togglePeerAudio,
    updateLocalStream,
  } = usePeerConnection({
    socket,
    userId: userIdRef.current,
    roomId: roomId || "",
    onStreamAdded: handleStreamAdded,
    onStreamRemoved: handleStreamRemoved,
    onConnectionStateChange: handleConnectionStateChange,
  });

  const {
    audioEnabled,
    localVideoRef,
    permissionError,
    retryMediaAccess,
    retryVideoAccess,
    setVideoPermissionError,
    stream,
    streamReady,
    toggleAudio,
    toggleVideo,
    videoEnabled,
    videoPermissionError,
  } = useMediaStream({ 
    roomId, 
    socket, 
    userPicture: userInfo?.picture,
    onStreamUpdated: updateLocalStream 
  });

  const hasJoinedRef = useRef(false);

  // Reset join flag when room changes
  useEffect(() => {
    hasJoinedRef.current = false;
  }, [roomId]);

  // Join room when socket and stream are ready (and no permission error)
  useEffect(() => {
    if (socket && roomId && userIdRef.current && streamReady && stream && setLocalStream && !hasJoinedRef.current && !permissionError) {
      // Set local stream in peer connection manager
      setLocalStream(stream);

      socket.emit("joinRoom", {
        roomId,
        userId: userIdRef.current,
        username: usernameRef.current || userInfo?.username || "Anonymous",
        profilePicture: userInfo?.picture,
      });

      hasJoinedRef.current = true;
      setIsConnecting(true);
    }
  }, [socket, roomId, userIdRef, usernameRef, userInfo, streamReady, stream, setLocalStream, setIsConnecting, permissionError]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // Handle current participants when joining
    socket.on("currentParticipants", async (participantsList) => {
      setMultipleParticipants(participantsList);
      setIsConnecting(false);

      // Ensure local stream is set and connect to all existing participants
      if (stream && setLocalStream) {
        setLocalStream(stream);
        await connectToMultiplePeers(participantsList);
      }
    });

    // Handle new user joining
    socket.on("userJoined", async (participant) => {
      addParticipant(participant);

      // Ensure local stream is set and connect to the new user
      // Only initiate if our userId is lexicographically greater (to prevent collisions)
      const shouldInitiate = userIdRef.current > participant.userId;

      if (stream && setLocalStream) {
        setLocalStream(stream);
        await connectToPeer(participant.userId, shouldInitiate);
      }
    });

    // Handle user leaving
    socket.on("userLeft", ({ userId }) => {
      disconnectFromPeer(userId);
      removeParticipant(userId);
    });

    // Handle video toggle from other users
    socket.on("participantVideoToggled", ({ userId, videoEnabled }) => {
      updateParticipantMediaState(userId, { video: videoEnabled });
    });

    // Handle audio toggle from other users
    socket.on("participantAudioToggled", ({ userId, audioEnabled }) => {
      updateParticipantMediaState(userId, { audio: audioEnabled });
    });

    // Handle errors
    socket.on("error", ({ message }) => {
      setRoomError(message);
      setIsConnecting(false);
    });

    return () => {
      socket.off("currentParticipants");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("participantVideoToggled");
      socket.off("participantAudioToggled");
      socket.off("error");
    };
  }, [socket, stream, setMultipleParticipants, addParticipant, removeParticipant, updateParticipantMediaState, connectToPeer, connectToMultiplePeers, disconnectFromPeer, setRoomError, setIsConnecting, setLocalStream, userIdRef]);


  // Handle local video toggle
  const handleToggleVideo = useCallback(() => {
    toggleVideo();
    togglePeerVideo(!videoEnabled);

    // Emit to other users
    if (socket && roomId) {
      socket.emit("toggleVideo", {
        roomId,
        userId: userIdRef.current,
        videoEnabled: !videoEnabled,
      });
    }
  }, [toggleVideo, togglePeerVideo, videoEnabled, socket, roomId, userIdRef]);

  // Handle local audio toggle
  const handleToggleAudio = useCallback(() => {
    toggleAudio();
    togglePeerAudio(!audioEnabled);

    // Emit to other users
    if (socket && roomId) {
      socket.emit("toggleAudio", {
        roomId,
        userId: userIdRef.current,
        audioEnabled: !audioEnabled,
      });
    }
  }, [toggleAudio, togglePeerAudio, audioEnabled, socket, roomId, userIdRef]);

  // Handle leaving room
  const handleLeaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit("leaveRoom", {
        roomId,
        userId: userIdRef.current,
      });
    }

    // Reset join flag for next room
    hasJoinedRef.current = false;

    // Navigate back to dashboard
    window.location.href = "/dashboard";
  }, [socket, roomId, userIdRef]);

  return (
    <Room
      audioEnabled={audioEnabled}
      localStream={stream}
      localUserId={userIdRef.current}
      localUsername={usernameRef.current || userInfo?.username || "Anonymous"}
      localVideoEnabled={videoEnabled}
      localVideoRef={localVideoRef}
      participants={participants}
      permissionError={permissionError}
      profilePicture={userInfo?.picture}
      retryMediaAccess={retryMediaAccess}
      retryVideoAccess={retryVideoAccess}
      setVideoPermissionError={setVideoPermissionError}
      videoPermissionError={videoPermissionError}
      roomId={roomId}
      roomName={roomName}
      roomError={roomError}
      isConnecting={isConnecting}
      toggleAudio={handleToggleAudio}
      toggleVideo={handleToggleVideo}
      onLeaveRoom={handleLeaveRoom}
      username={userInfo?.username}
      socket={socket}
    />
  );
};

export default RoomContainer;