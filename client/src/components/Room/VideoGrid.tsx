import React from "react";
import { VolumeX } from "lucide-react";
import { Participant } from "./useRoomState";
import "./VideoGrid.css";

interface VideoGridProps {
  localStream: MediaStream | null;
  localUserId: string;
  localUsername: string;
  localVideoEnabled: boolean;
  localAudioEnabled: boolean;
  participants: Map<string, Participant>;
  profilePicture?: string;
}

interface VideoElementProps {
  stream: MediaStream | null;
  userId: string;
  username: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  profilePicture?: string;
  isLocal: boolean;
}

const VideoElement: React.FC<VideoElementProps> = ({
  stream,
  userId,
  username,
  videoEnabled,
  audioEnabled,
  profilePicture,
  isLocal
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isLocal, userId, videoEnabled]);

  // Check if video is actually enabled (stream exists, has video tracks, and they're enabled)
  const hasActiveVideo = stream && stream.getVideoTracks().length > 0 && 
                        stream.getVideoTracks().some(track => track.enabled) && 
                        videoEnabled;

  return (
    <div 
      className="video-element" 
      data-user-id={userId}
      role="img"
      aria-label={`${username}${isLocal ? ' (you)' : ''} - ${videoEnabled ? 'Video on' : 'Video off'}, ${audioEnabled ? 'Audio on' : 'Audio off'}`}
    >
      {hasActiveVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="video-stream"
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : (
        <div className="video-placeholder" aria-hidden="true">
          {profilePicture ? (
            <img src={profilePicture} alt="" className="profile-picture" />
          ) : (
            <div className="avatar-placeholder">{username.charAt(0).toUpperCase()}</div>
          )}
        </div>
      )}
      
      <div className="video-overlay" aria-hidden="true">
        <span className="username">{username}{isLocal ? ' (You)' : ''}</span>
        <div className="media-indicators">
          {!audioEnabled && (
            <span 
              className="muted-indicator" 
              title="Microphone muted" 
              aria-label="Muted"
            >
              <VolumeX size={18} className="text-red-400" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoGrid: React.FC<VideoGridProps> = ({
  localStream,
  localUserId,
  localUsername,
  localVideoEnabled,
  localAudioEnabled,
  participants,
  profilePicture
}) => {
  // Calculate total participants including local user
  const totalParticipants = participants.size + 1;

  // Determine grid layout class based on participant count
  const getGridLayoutClass = () => {
    switch (totalParticipants) {
      case 1:
        return "grid-layout-1";
      case 2:
        return "grid-layout-2";
      case 3:
        return "grid-layout-3";
      case 4:
        return "grid-layout-4";
      case 5:
        return "grid-layout-5";
      case 6:
        return "grid-layout-6";
      default:
        return "grid-layout-6"; // Max 6 supported
    }
  };

  // Convert participants map to array and sort by join order (userId)
  const participantArray = Array.from(participants.values()).sort((a, b) => 
    a.userId.localeCompare(b.userId)
  );

  const renderVideoElements = () => {
    const allParticipants = [
      {
        stream: localStream,
        userId: localUserId,
        username: localUsername,
        videoEnabled: localVideoEnabled,
        audioEnabled: localAudioEnabled,
        profilePicture: profilePicture,
        isLocal: true
      },
      ...participantArray.map(p => ({
        stream: p.stream || null,
        userId: p.userId,
        username: p.username,
        videoEnabled: p.mediaState.video,
        audioEnabled: p.mediaState.audio,
        profilePicture: p.profilePicture,
        isLocal: false
      }))
    ];

    // Special case for 5 participants: use flexbox rows for centered layout
    if (totalParticipants === 5) {
      return (
        <>
          <div className="video-row">
            {allParticipants.slice(0, 3).map((participant) => (
              <VideoElement key={participant.userId} {...participant} />
            ))}
          </div>
          <div className="video-row">
            {allParticipants.slice(3, 5).map((participant) => (
              <VideoElement key={participant.userId} {...participant} />
            ))}
          </div>
        </>
      );
    }

    // All other layouts handled by CSS Grid
    return allParticipants.map((participant) => (
      <VideoElement key={participant.userId} {...participant} />
    ));
  };

  return (
    <div className={`video-grid ${getGridLayoutClass()}`}>
      {renderVideoElements()}
    </div>
  );
};

export default VideoGrid;