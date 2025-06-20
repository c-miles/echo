export type ControlBarProps = {
  audioEnabled: boolean;
  isMessageThreadOpen: boolean;
  toggleAudio: () => void;
  toggleMessageThread: () => void;
  toggleVideo: () => void;
  videoEnabled: boolean;
  onLeaveRoom?: () => void;
  participantCount?: number;
  onShareRoom?: () => void;
  isMobile: boolean;
};
