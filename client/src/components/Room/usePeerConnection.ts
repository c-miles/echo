import { useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { PeerConnectionManager } from "./PeerConnectionManager";
import { Participant } from "./useRoomState";

// MediaConstraints interface removed as it's not being used

interface UsePeerConnectionProps {
  socket: Socket | null;
  userId: string;
  roomId: string;
  onStreamAdded: (userId: string, stream: MediaStream) => void;
  onStreamRemoved: (userId: string) => void;
  onConnectionStateChange: (userId: string, state: RTCPeerConnectionState) => void;
}

export default function usePeerConnection({
  socket,
  userId,
  roomId,
  onStreamAdded,
  onStreamRemoved,
  onConnectionStateChange
}: UsePeerConnectionProps) {
  const peerManagerRef = useRef<PeerConnectionManager | null>(null);

  // Store callbacks in refs to avoid recreating PeerConnectionManager
  const callbacksRef = useRef({
    onStreamAdded,
    onStreamRemoved,
    onConnectionStateChange
  });

  // Update callback refs when they change
  useEffect(() => {
    callbacksRef.current = {
      onStreamAdded,
      onStreamRemoved,
      onConnectionStateChange
    };
  }, [onStreamAdded, onStreamRemoved, onConnectionStateChange]);

  // Initialize peer connection manager
  useEffect(() => {
    if (!socket || !userId || !roomId) return;
    
    // Only create if we don't have one already
    if (peerManagerRef.current) {
      return;
    }

    peerManagerRef.current = new PeerConnectionManager(
      socket,
      userId,
      roomId,
      callbacksRef.current
    );

    return () => {
      peerManagerRef.current?.cleanup();
      peerManagerRef.current = null;
    };
  }, [socket, userId, roomId]);

  // Set local stream
  const setLocalStream = useCallback((stream: MediaStream) => {
    if (!peerManagerRef.current) return;
    peerManagerRef.current.setLocalStream(stream);
  }, []);

  // Connect to a new peer
  const connectToPeer = useCallback(async (targetUserId: string, isInitiator: boolean = true) => {
    if (!peerManagerRef.current) return;
    
    try {
      await peerManagerRef.current.createPeerConnection(targetUserId, isInitiator);
    } catch (error) {
      console.error(`Failed to connect to peer ${targetUserId}:`, error);
    }
  }, []);

  // Connect to multiple peers (for when joining a room with existing participants)
  const connectToMultiplePeers = useCallback(async (participants: Participant[]) => {
    if (!peerManagerRef.current) return;
    
    // Connect to each participant with proper initiator logic
    for (const participant of participants) {
      const shouldInitiate = userId > participant.userId;
      await connectToPeer(participant.userId, shouldInitiate);
    }
  }, [connectToPeer, userId]);

  // Disconnect from a peer
  const disconnectFromPeer = useCallback((userId: string) => {
    peerManagerRef.current?.removePeer(userId);
  }, []);

  // Toggle video
  const toggleVideo = useCallback((enabled: boolean) => {
    peerManagerRef.current?.toggleVideo(enabled);
  }, []);

  // Toggle audio
  const toggleAudio = useCallback((enabled: boolean) => {
    peerManagerRef.current?.toggleAudio(enabled);
  }, []);

  // Update local stream (for changing cameras/microphones)
  const updateLocalStream = useCallback((stream: MediaStream) => {
    peerManagerRef.current?.updateLocalStream(stream);
  }, []);

  return {
    setLocalStream,
    connectToPeer,
    connectToMultiplePeers,
    disconnectFromPeer,
    toggleVideo,
    toggleAudio,
    updateLocalStream,
  };
}