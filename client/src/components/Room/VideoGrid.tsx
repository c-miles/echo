import React from "react";
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
    <div className="video-element" data-user-id={userId}>
      {hasActiveVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="video-stream"
        />
      ) : (
        <div className="video-placeholder">
          {profilePicture ? (
            <img src={profilePicture} alt={username} className="profile-picture" />
          ) : (
            <div className="avatar-placeholder">{username.charAt(0).toUpperCase()}</div>
          )}
        </div>
      )}
      
      <div className="video-overlay">
        <span className="username">{username}</span>
        <div className="media-indicators">
          {!audioEnabled && (
            <span className="muted-indicator" title="Muted">🔇</span>
          )}
          {!videoEnabled && (
            <span className="video-off-indicator" title="Video Off">📹</span>
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

    // Special layouts for odd numbers using flexbox
    if (totalParticipants === 1) {
      return (
        <VideoElement {...allParticipants[0]} />
      );
    }

    if (totalParticipants === 3) {
      return allParticipants.map((participant) => (
        <VideoElement key={participant.userId} {...participant} />
      ));
    }

    if (totalParticipants === 5) {
      return (
        <>
          <div className="video-row top-row">
            <VideoElement {...allParticipants[0]} />
            <VideoElement {...allParticipants[1]} />
            <VideoElement {...allParticipants[2]} />
          </div>
          <div className="video-row bottom-row">
            <VideoElement {...allParticipants[3]} />
            <VideoElement {...allParticipants[4]} />
          </div>
        </>
      );
    }

    // Default grid layout for even numbers (2, 4, 6)
    return allParticipants.map((participant, index) => (
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