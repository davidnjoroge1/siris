import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

interface LiveChatProps {
  roomId: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages.reverse());
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      createdAt: new Date(),
    });

    setNewMessage('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-96 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Live Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.userName}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-l-md px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded-r-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default LiveChat;