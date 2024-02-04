import React, { useState, useRef, useEffect } from "react";
import Room from "./Room";

import useAuthUser from "../../hooks/useAuthUser";
import useMediaStream from "./useMediaStream";
import usePeerConnection from "./usePeerConnection";
import useRoomState from "./useRoomState";
import useSocket from "../../services/useSocket";

const RoomContainer: React.FC = () => {
  const { userInfo } = useAuthUser();
  const { peerConnectionRef } = usePeerConnection();
  const socket = useSocket();

  const {
    isHost,
    remoteUserPicture,
    remoteVideoEnabled,
    roomId,
    setRemoteUserPicture,
    setRemoteVideoEnabled,
    userIdRef,
  } = useRoomState();

  const { stream, streamReady, localVideoRef, toggleVideo, videoEnabled } =
    useMediaStream({ roomId, socket, userPicture: userInfo?.picture });

  const [readyForIce, setReadyForIce] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", roomId);
    }
  }, [socket]);

  useEffect(() => {
    if (streamReady && stream && socket && peerConnectionRef.current) {
      let peerConnection = peerConnectionRef.current;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      const newRemoteStream = new MediaStream();

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
        });
        setRemoteStream(newRemoteStream);
      };

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = newRemoteStream;
      }

      let bufferedIceCandidates: RTCIceCandidate[] = [];
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          if (readyForIce) {
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate: event.candidate,
            });
          } else {
            bufferedIceCandidates.push(event.candidate);
          }
        }
      };

      socket.on("peerReadyForIce", ({ userId }) => {
        if (userId !== userIdRef.current && bufferedIceCandidates.length > 0) {
          bufferedIceCandidates.forEach((candidate) => {
            socket.emit("sendCandidate", {
              roomId,
              userId: userIdRef.current,
              candidate,
            });
          });
          bufferedIceCandidates = [];
          setReadyForIce(true);
        }
      });

      socket.on("receiveCandidate", ({ userId, candidate }) => {
        if (userId !== userIdRef.current && candidate) {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      if (isHost) {
        peerConnection.createOffer().then(async (offer) => {
          await peerConnection.setLocalDescription(offer);
          socket.emit("sendOffer", {
            roomId,
            userId: userIdRef.current,
            sdp: offer.sdp,
          });
        });

        socket.on("receiveAnswer", async ({ sdp }) => {
          if (sdp) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp })
            );
            socket.emit("readyForIce", { roomId, userId: userIdRef.current });
          }
        });
      } else {
        socket.emit("requestOffer", { roomId });

        socket.on("receiveOffer", async ({ sdp }) => {
          if (sdp) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription({ type: "offer", sdp })
            );

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit("sendAnswer", {
              roomId,
              userId: userIdRef.current,
              sdp: answer.sdp,
            });

            socket.emit("readyForIce", { roomId, userId: userIdRef.current });
          }
        });
      }

      if (socket) {
        socket.on("videoToggled", ({ userId, videoEnabled, userPicture }) => {
          if (userId !== userIdRef.current) {
            setRemoteVideoEnabled(videoEnabled);
            if (!videoEnabled) {
              setRemoteUserPicture(userPicture);
            }
          }
        });
      }
    }
  }, [streamReady]);

  return (
    <Room
      localVideoRef={localVideoRef}
      remoteStream={remoteStream}
      remoteUserPicture={remoteUserPicture}
      remoteVideoEnabled={remoteVideoEnabled}
      remoteVideoRef={remoteVideoRef}
      roomId={roomId}
      toggleVideo={toggleVideo}
      username={userInfo?.username}
      userPicture={userInfo?.picture}
      videoEnabled={videoEnabled}
    />
  );
};

export default RoomContainer;
