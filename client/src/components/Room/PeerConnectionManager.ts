import { Socket } from "socket.io-client";

interface PeerConnection {
  connection: RTCPeerConnection;
  stream?: MediaStream;
  userId: string;
  iceCandidatesQueue: RTCIceCandidate[];
}

export class PeerConnectionManager {
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private socket: Socket;
  private userId: string;
  private roomId: string;
  private callbacks: {
    onStreamAdded: (userId: string, stream: MediaStream) => void;
    onStreamRemoved: (userId: string) => void;
    onConnectionStateChange: (userId: string, state: RTCPeerConnectionState) => void;
  };

  constructor(
    socket: Socket,
    userId: string,
    roomId: string,
    callbacks: {
      onStreamAdded: (userId: string, stream: MediaStream) => void;
      onStreamRemoved: (userId: string) => void;
      onConnectionStateChange: (userId: string, state: RTCPeerConnectionState) => void;
    }
  ) {
    this.socket = socket;
    this.userId = userId;
    this.roomId = roomId;
    this.callbacks = callbacks;

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // Handle incoming offers
    this.socket.on("receiveOffer", async ({ offer, fromUserId }: { offer: RTCSessionDescriptionInit; fromUserId: string }) => {
      await this.handleOffer(fromUserId, offer);
    });

    // Handle incoming answers
    this.socket.on("receiveAnswer", async ({ answer, fromUserId }: { answer: RTCSessionDescriptionInit; fromUserId: string }) => {
      await this.handleAnswer(fromUserId, answer);
    });

    // Handle incoming ICE candidates
    this.socket.on("receiveIceCandidate", async ({ candidate, fromUserId }: { candidate: RTCIceCandidateInit; fromUserId: string }) => {
      await this.handleIceCandidate(fromUserId, candidate);
    });
  }

  setLocalStream(stream: MediaStream): void {
    this.localStream = stream;
    // Update all existing peer connections with the stream
    this.peers.forEach((peer) => {
      const pc = peer.connection;
      stream.getTracks().forEach(track => {
        const sender = pc.getSenders().find(s => s.track?.kind === track.kind);
        if (!sender) {
          pc.addTrack(track, stream);
        }
      });
    });
  }

  async createPeerConnection(targetUserId: string, isInitiator: boolean): Promise<void> {
    if (this.peers.has(targetUserId)) {
      return;
    }

    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
      iceTransportPolicy: "all",
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require"
    };

    const pc = new RTCPeerConnection(configuration);
    const peer: PeerConnection = {
      connection: pc,
      userId: targetUserId,
      iceCandidatesQueue: []
    };

    this.peers.set(targetUserId, peer);

    // Add local tracks to the connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        peer.stream = event.streams[0];
        this.callbacks.onStreamAdded(targetUserId, event.streams[0]);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("sendIceCandidate", {
          targetUserId,
          candidate: event.candidate,
          fromUserId: this.userId
        });
      }
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      this.callbacks.onConnectionStateChange(targetUserId, pc.connectionState);

      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        this.removePeer(targetUserId);
      }
    };

    // Create offer if initiator
    if (isInitiator) {
      await this.createAndSendOffer(targetUserId);
    }
  }

  private async createAndSendOffer(targetUserId: string): Promise<void> {
    const peer = this.peers.get(targetUserId);
    if (!peer) {
      return;
    }

    try {
      const offer = await peer.connection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await peer.connection.setLocalDescription(offer);

      this.socket.emit("sendOffer", {
        targetUserId,
        offer: peer.connection.localDescription,
        fromUserId: this.userId
      });
    } catch (error) {
      console.error(`Error creating/sending offer for ${targetUserId}:`, error);
    }
  }

  private async handleOffer(fromUserId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    // If we already have a peer connection and it's in have-local-offer state,
    // we have an offer collision. Resolve by comparing user IDs
    const existingPeer = this.peers.get(fromUserId);
    if (existingPeer && existingPeer.connection.signalingState === "have-local-offer") {
      // Use lexicographic comparison to determine who backs down
      if (this.userId > fromUserId) {
        // Reset the peer connection and recreate as non-initiator
        existingPeer.connection.close();
        this.peers.delete(fromUserId);
        // Create new connection as non-initiator (will not send offer)
        await this.createPeerConnection(fromUserId, false);
      } else {
        return;
      }
    } else if (!this.peers.has(fromUserId)) {
      // Create peer connection if it doesn't exist
      await this.createPeerConnection(fromUserId, false);
    }

    const peer = this.peers.get(fromUserId);
    if (!peer) return;

    try {
      await peer.connection.setRemoteDescription(new RTCSessionDescription(offer));

      // Process queued ICE candidates
      while (peer.iceCandidatesQueue.length > 0) {
        const candidate = peer.iceCandidatesQueue.shift()!;
        await peer.connection.addIceCandidate(candidate);
      }

      // Create and send answer
      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer);

      this.socket.emit("sendAnswer", {
        targetUserId: fromUserId,
        answer: peer.connection.localDescription,
        fromUserId: this.userId
      });
    } catch (error) {
      console.error(`Error handling offer from ${fromUserId}:`, error);
    }
  }

  private async handleAnswer(fromUserId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peer = this.peers.get(fromUserId);
    if (!peer) return;

    try {
      // Check if we're in the right state to handle an answer
      if (peer.connection.signalingState !== "have-local-offer") {
        return;
      }

      await peer.connection.setRemoteDescription(new RTCSessionDescription(answer));

      // Process queued ICE candidates
      while (peer.iceCandidatesQueue.length > 0) {
        const candidate = peer.iceCandidatesQueue.shift()!;
        await peer.connection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error(`Error handling answer from ${fromUserId}:`, error);
    }
  }

  private async handleIceCandidate(fromUserId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peer = this.peers.get(fromUserId);
    if (!peer) return;

    try {
      const iceCandidate = new RTCIceCandidate(candidate);

      if (peer.connection.remoteDescription) {
        await peer.connection.addIceCandidate(iceCandidate);
      } else {
        // Queue candidate if remote description not set yet
        peer.iceCandidatesQueue.push(iceCandidate);
      }
    } catch (error) {
      console.error(`Error handling ICE candidate from ${fromUserId}:`, error);
    }
  }

  removePeer(userId: string): void {
    const peer = this.peers.get(userId);
    if (peer) {
      peer.connection.close();
      this.peers.delete(userId);
      this.callbacks.onStreamRemoved(userId);
    }
  }

  removeAllPeers(): void {
    this.peers.forEach((peer, userId) => {
      peer.connection.close();
      this.callbacks.onStreamRemoved(userId);
    });
    this.peers.clear();
  }

  updateLocalStream(stream: MediaStream): void {
    this.localStream = stream;

    // Update all peer connections with new stream
    this.peers.forEach((peer) => {
      const senders = peer.connection.getSenders();

      stream.getTracks().forEach(track => {
        const sender = senders.find(s => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          peer.connection.addTrack(track, stream);
        }
      });
    });
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  cleanup(): void {
    this.removeAllPeers();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}