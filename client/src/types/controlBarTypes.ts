export type ControlBarProps = {
  audioEnabled: boolean;
  toggleAudio: () => void;
  toggleMessageThread: () => void;
  toggleVideo: () => void;
  videoEnabled: boolean;
  onLeaveRoom?: () => void;
  participantCount?: number;
  onShareRoom?: () => void;
};
