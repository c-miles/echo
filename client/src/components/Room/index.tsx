import React, { useState, useRef, useEffect } from "react";
import Room from "./Room";

import useMediaStream from "./useMediaStream";
import usePeerConnection from "./usePeerConnection";
import useRoomState from "./useRoomState";
import useSocket from "../../services/useSocket";

const RoomContainer: React.FC = () => {
  const { stream, streamReady, localVideoRef } = useMediaStream();
  const { peerConnectionRef } = usePeerConnection();
  const { roomId, isHost, userIdRef } = useRoomState();
  const socket = useSocket();

  const [readyForIce, setReadyForIce] = useState<boolean>(false);
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
        peerConnection?.addTrack(track, stream);
      });

      let remoteStream = new MediaStream();

      // if (peerConnection) {
      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
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
            // Set remote description
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription({ type: "offer", sdp })
            );

            // Create and set local answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Emit the answer
            socket.emit("sendAnswer", {
              roomId,
              userId: userIdRef.current,
              sdp: answer.sdp,
            });

            // Notify that the peer is ready for ICE
            socket.emit("readyForIce", { roomId, userId: userIdRef.current });
          }
        });
      }
      // }
    }
  }, [streamReady]);

  return (
    <Room
      localVideoRef={localVideoRef}
      remoteVideoRef={remoteVideoRef}
      stream={stream}
    />
  );
};

export default RoomContainer;
