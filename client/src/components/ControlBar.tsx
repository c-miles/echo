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
  isMobile,
}) => {
  if (isMobile) {
    return (
      <div className="w-full bg-surface border-t border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-sm mx-auto">
          <div className="flex items-center gap-3">
            <IconButton
              onClick={toggleAudio}
              variant={audioEnabled ? "default" : "danger"}
              size="sm"
            >
              {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </IconButton>

            <IconButton
              onClick={toggleVideo}
              variant={videoEnabled ? "default" : "danger"}
              size="sm"
            >
              {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </IconButton>
          </div>

          {participantCount && (
            <div className="flex items-center gap-2 px-2 py-1 bg-primary rounded-full">
              <Users size={14} className="text-text" />
              <span className="text-xs font-medium text-text">{participantCount}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <IconButton
              onClick={toggleMessageThread}
              variant={isMessageThreadOpen ? "primary" : "default"}
              size="sm"
            >
              <MessageSquare size={18} />
            </IconButton>

            {onLeaveRoom && (
              <IconButton
                onClick={onLeaveRoom}
                variant="danger"
                size="sm"
              >
                <LogOut size={18} />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="w-full bg-surface border-t border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center min-w-[120px]">
          {participantCount && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-full">
              <Users size={16} className="text-text" />
              <span className="text-sm font-medium text-text">{participantCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <IconButton
            onClick={toggleAudio}
            variant={audioEnabled ? "default" : "danger"}
          >
            {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </IconButton>

          <IconButton
            onClick={toggleVideo}
            variant={videoEnabled ? "default" : "danger"}
          >
            {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </IconButton>

          {onShareRoom && (
            <IconButton
              onClick={onShareRoom}
              variant="primary"
            >
              <Share2 size={20} />
            </IconButton>
          )}

          {onLeaveRoom && (
            <IconButton
              onClick={onLeaveRoom}
              variant="danger"
            >
              <LogOut size={20} />
            </IconButton>
          )}
        </div>

        <div className="flex items-center justify-end min-w-[120px]">
          <IconButton
            onClick={toggleMessageThread}
            variant={isMessageThreadOpen ? "primary" : "default"}
          >
            <MessageSquare size={20} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
