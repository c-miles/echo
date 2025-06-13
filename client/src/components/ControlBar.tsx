import React from "react";
import {
  LogOut,
  MessageSquare,
  Mic,
  MicOff,
  Users,
  Share2,
  Video,
  VideoOff,
} from "lucide-react";
import { ControlBarProps } from "../types/controlBarTypes";
import { IconButton } from "./atoms";

const ControlBar: React.FC<ControlBarProps> = ({
  audioEnabled,
  isMessageThreadOpen,
  onLeaveRoom,
  onShareRoom,
  participantCount,
  toggleAudio,
  toggleMessageThread,
  toggleVideo,
  videoEnabled,
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-surface/90 backdrop-blur border-t border-slate-700 flex items-center justify-between px-4">
      {/* Left Section - Participant Count */}
      <div className="flex items-center min-w-[120px]">
        {participantCount && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-full">
            <Users size={16} className="text-text" />
            <span className="text-sm font-medium text-text">{participantCount}</span>
          </div>
        )}
      </div>

      {/* Center Section - Main Controls */}
      <div className="flex items-center gap-2">
        <IconButton
          onClick={toggleAudio}
          variant={audioEnabled ? "default" : "danger"}
          aria-label={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {audioEnabled ? (
            <Mic size={20} />
          ) : (
            <MicOff size={20} />
          )}
        </IconButton>
        
        <IconButton
          onClick={toggleVideo}
          variant={videoEnabled ? "default" : "danger"}
          aria-label={videoEnabled ? "Turn on camera" : "Turn on camera"}
        >
          {videoEnabled ? (
            <Video size={20} />
          ) : (
            <VideoOff size={20} />
          )}
        </IconButton>
        
        {onShareRoom && (
          <IconButton
            onClick={onShareRoom}
            variant="primary"
            aria-label="Share room"
          >
            <Share2 size={20} />
          </IconButton>
        )}
        
        {onLeaveRoom && (
          <IconButton
            onClick={onLeaveRoom}
            variant="danger"
            aria-label="Leave room"
          >
            <LogOut size={20} />
          </IconButton>
        )}
      </div>

      {/* Right Section - Chat Toggle */}
      <div className="flex items-center justify-end min-w-[120px]">
        <IconButton
          onClick={toggleMessageThread}
          variant="default"
          aria-label={isMessageThreadOpen ? "Close chat" : "Open chat"}
        >
          <MessageSquare size={20} />
        </IconButton>
      </div>
    </footer>
  );
};

export default ControlBar;