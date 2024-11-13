import React, { useEffect, useRef, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface VideoChatProps {
  roomId: string;
}

const VideoChat: React.FC<VideoChatProps> = ({ roomId }) => {
  const { currentUser } = useAuth();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const setupVideoChat = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateRef = doc(db, 'rooms', roomId, 'candidates', currentUser?.uid || 'anonymous');
          setDoc(candidateRef, { candidate: event.candidate.toJSON() }, { merge: true });
        }
      };

      peerConnectionRef.current = peerConnection;

      const offerCandidates = collection(db, 'rooms', roomId, 'candidates');
      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data().candidate);
            peerConnection.addIceCandidate(candidate);
          }
        });
      });

      const roomRef = doc(db, 'rooms', roomId);
      onSnapshot(roomRef, (snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          peerConnection.setRemoteDescription(answerDescription);
        }
      });

      const offerDescription = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offerDescription);

      await updateDoc(roomRef, { offer: offerDescription });
    };

    if (currentUser) {
      setupVideoChat();
    }

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex justify-center space-x-4 mt-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Local Video</h3>
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Remote Video</h3>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black" />
      </div>
    </div>
  );
};

export default VideoChat;