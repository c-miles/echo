import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import ControlBar from "../ControlBar";
import MessageThread from "../MessageThread";
import ShareRoomModal from "../ShareRoomModal";
import PermissionErrorModal from "../PermissionErrorModal";
import VideoGrid from "./VideoGrid";
import { Participant } from "./useRoomState";
import "./Room.css";

interface RoomProps {
  audioEnabled: boolean;
  localStream: MediaStream | null;
  localUserId: string;
  localUsername: string;
  localVideoEnabled: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  participants: Map<string, Participant>;
  permissionError: 'denied' | 'notfound' | 'other' | null;
  profilePicture?: string;
  retryMediaAccess: () => void;
  retryVideoAccess: () => void;
  setVideoPermissionError: (error: 'denied' | 'notfound' | 'other' | null) => void;
  videoPermissionError: 'denied' | 'notfound' | 'other' | null;
  roomId: string | undefined;
  roomName?: string;
  roomError: string | null;
  isConnecting: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  onLeaveRoom: () => void;
  username?: string;
  socket: any;
}

const Room: React.FC<RoomProps> = ({
  audioEnabled,
  localStream,
  localUserId,
  localUsername,
  localVideoEnabled,
  localVideoRef,
  participants,
  permissionError,
  profilePicture,
  retryMediaAccess,
  retryVideoAccess,
  setVideoPermissionError,
  videoPermissionError,
  roomId,
  roomName,
  roomError,
  isConnecting,
  toggleAudio,
  toggleVideo,
  onLeaveRoom,
  username,
  socket,
}) => {
  const [isMessageThreadOpen, setIsMessageThreadOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMessageThread = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
  };

  const handleShareRoom = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Show permission error modal
  if (permissionError) {
    return (
      <div className="app-layout">
        <div className="room-container">
          <div className="video-area">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <h3 className="text-lg font-medium text-text">
                Preparing to join room...
              </h3>
            </div>
          </div>
        </div>
        
        <PermissionErrorModal
          open={true}
          onClose={onLeaveRoom}
          onRetry={retryMediaAccess}
          errorType={permissionError}
          mediaType="audio"
        />
      </div>
    );
  }

  // Show error state
  if (roomError) {
    return (
      <div className="app-layout">
        <div className="room-container">
          <div className="video-area">
            <div className="max-w-md mx-auto p-6 rounded-lg border border-red-500/20 bg-red-500/10">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="text-red-500" size={24} />
                <h2 className="text-lg font-semibold text-red-400">Unable to join room</h2>
              </div>
              <p className="text-red-300">{roomError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isConnecting) {
    return (
      <div className="app-layout">
        <div className="room-container">
          <div className="video-area">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <h3 className="text-lg font-medium text-text">
                Connecting to room...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main room layout
  return (
    <div className="app-layout">
      <div className={`room-container ${isMessageThreadOpen ? 'chat-open' : ''}`}>
        <div className="video-area">
          <VideoGrid
            localStream={localStream}
            localUserId={localUserId}
            localUsername={localUsername}
            localVideoEnabled={localVideoEnabled}
            localAudioEnabled={audioEnabled}
            participants={participants}
            profilePicture={profilePicture}
            isMobile={isMobile}
          />
        </div>

        {isMobile && (
          <div 
            className={`chat-backdrop ${isMessageThreadOpen ? 'open' : ''}`} 
            onClick={toggleMessageThread}
            style={{ pointerEvents: isMessageThreadOpen ? 'auto' : 'none' }}
          />
        )}
        
        <div className={`chat-drawer ${isMessageThreadOpen ? 'open' : ''}`}>
          {roomId && (
            <MessageThread 
              roomId={roomId} 
              username={username || localUsername} 
              socket={socket} 
            />
          )}
        </div>
      </div>

      <div className="app-footer">
        <ControlBar
          audioEnabled={audioEnabled}
          isMessageThreadOpen={isMessageThreadOpen}
          toggleAudio={toggleAudio}
          toggleMessageThread={toggleMessageThread}
          toggleVideo={toggleVideo}
          videoEnabled={localVideoEnabled}
          onLeaveRoom={onLeaveRoom}
          onShareRoom={handleShareRoom}
          participantCount={participants.size + 1}
          isMobile={isMobile}
        />
      </div>

      <video ref={localVideoRef} autoPlay muted playsInline style={{ display: "none" }} />

      {roomName && roomId && (
        <ShareRoomModal
          open={isShareModalOpen}
          onClose={handleCloseShareModal}
          roomName={roomName}
          roomId={roomId}
        />
      )}
      
      <PermissionErrorModal
        open={!!videoPermissionError}
        onClose={() => setVideoPermissionError(null)}
        onRetry={retryVideoAccess}
        errorType={videoPermissionError || 'other'}
        mediaType="video"
      />
    </div>
  );
};

export default Room;