import React, { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Room, Participant } from '../types';

interface ParticipantListProps {
  roomId: string;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ roomId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;
        setParticipants(Object.values(roomData.participants));
      }
    });

    return unsubscribe;
  }, [roomId]);

  return (
    <div>
      <h3>Participants</h3>
      <ul>
        {participants.map((participant) => (
          <li key={participant.uid}>
            {participant.role}: {participant.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantList;