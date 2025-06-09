import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import ControlBar from "../ControlBar";
import MessageThread from "../MessageThread";
import ShareRoomModal from "../ShareRoomModal";
import VideoGrid from "./VideoGrid";
import { Participant } from "./useRoomState";

interface RoomProps {
  audioEnabled: boolean;
  localStream: MediaStream | null;
  localUserId: string;
  localUsername: string;
  localVideoEnabled: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  participants: Map<string, Participant>;
  profilePicture?: string;
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
  profilePicture,
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

  const toggleMessageThread = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
  };

  const handleShareRoom = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Show error state
  if (roomError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-bg p-8">
        <div className="max-w-md mx-auto p-6 rounded-lg border border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-lg font-semibold text-red-400">Unable to join room</h2>
          </div>
          <p className="text-red-300">{roomError}</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-bg gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h3 className="text-lg font-medium text-text">
          Connecting to room...
        </h3>
      </div>
    );
  }

  return (
    <div className="room-wrapper flex flex-col bg-bg">
      {/* Room shell with CSS Grid for video and chat columns */}
      <div className={`room-shell ${isMessageThreadOpen ? 'chat-open' : ''}`} style={{
        height: 'calc(100vh - 9rem)' // 4rem navbar + 5rem footer
      }}>
        {/* Video area - auto-resizes based on available column width */}
        <div className="video-area flex items-center justify-center w-full">
          <VideoGrid
            localStream={localStream}
            localUserId={localUserId}
            localUsername={localUsername}
            localVideoEnabled={localVideoEnabled}
            localAudioEnabled={audioEnabled}
            participants={participants}
            profilePicture={profilePicture}
          />
        </div>

        {/* Chat drawer column - slides in with transform for flair */}
        <aside className={`chat-drawer overflow-hidden transition-transform duration-300 rounded-tl-lg ${
          isMessageThreadOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{
          border: '1px solid rgb(71, 85, 105)', // border-slate-600
          borderRight: 'none'
        }}>
          {isMessageThreadOpen && roomId && (
            <MessageThread roomId={roomId} username={username || localUsername} socket={socket} />
          )}
        </aside>
      </div>

      {/* Hidden video element for local stream initialization */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />

      {/* Fixed Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10" style={{ height: '5rem' }}>
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
        />
      </div>

      {roomName && roomId && (
        <ShareRoomModal
          open={isShareModalOpen}
          onClose={handleCloseShareModal}
          roomName={roomName}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default Room;