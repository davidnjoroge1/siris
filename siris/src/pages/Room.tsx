import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { onSnapshot, doc, updateDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import YouTubePlayer from '../components/MusicPlayer/YouTubePlayer';
import PlayerControls from '../components/MusicPlayer/PlayerControls';
import SearchBar from '../components/MusicPlayer/SearchBar';
import ParticipantList from '../components/ParticipantList';
import LiveChat from '../components/LiveChat';
import VideoChat from '../components/VideoChat';
import { Room as RoomType, Track } from '../types';
import { Video, Music, Users, MessageSquare } from 'lucide-react';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { currentUser } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track playing state
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev); // Toggle play/pause state
  }, []);

  // Handle previous track
  const handlePrevious = useCallback(() => {
    // Logic for skipping to the previous track
    console.log('Go to previous track');
  }, []);

  // Handle next track
  const handleNext = useCallback(() => {
    // Logic for skipping to the next track
    console.log('Go to next track');
  }, []);

  // Handle search
  const handleSearch = useCallback(async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const tracksRef = collection(db, 'tracks');
      const q = query(tracksRef, where('title', '>=', searchQuery), where('title', '<=', searchQuery + '\uf8ff'), limit(10));
      const querySnapshot = await getDocs(q);
      const results: Track[] = [];
      querySnapshot.forEach((doc) => {
        const trackData = doc.data() as Track;
        results.push({ ...trackData, id: doc.id });
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Select track for playback
  const handleTrackSelect = useCallback(async (track: Track) => {
    if (!roomId || !isHost) return;

    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        currentTrack: {
          id: track.id,
          videoId: track.videoId,
          title: track.title,
          artist: track.artist,
          thumbnailUrl: track.thumbnailUrl,
          duration: track.duration,
          startedAt: new Date(),
          position: 0,
        },
      });
    } catch (error) {
      console.error('Error updating track:', error);
    }
  }, [roomId, isHost]);

  // Fetch room data on mount
  useEffect(() => {
    if (!roomId || !currentUser) return;

    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as RoomType;
        setRoom(roomData);
        setIsHost(roomData.createdBy === currentUser.uid);
      }
    });

    // Add current user to the room
    const joinRoom = async () => {
      try {
        await updateDoc(roomRef, {
          [`participants.${currentUser.uid}`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'Anonymous',
            role: 'participant',
            joinedAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };

    joinRoom();

    return () => unsubscribe();
  }, [roomId, currentUser]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold mb-4">Room: {room?.name || 'Loading...'}</h1>
          {room?.currentTrack && (
            <>
              <YouTubePlayer
                videoId={room.currentTrack.videoId}
                isHost={isHost}
                roomId={roomId || ''}
              />
              {/* Pass only the necessary props to PlayerControls */}
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                disabled={!isHost} // Only host can control playback
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Users className="mr-2" />
              Participants
            </h2>
            <ParticipantList roomId={roomId || ''} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <MessageSquare className="mr-2" />
              Live Chat
            </h2>
            <LiveChat roomId={roomId || ''} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Video className="mr-2" />
            Video Chat
          </h2>
          <VideoChat roomId={roomId || ''} />
        </div>
      </div>

      {isHost && (
        <div className="bg-white border-t p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Music className="mr-2" />
            Music Search
          </h2>
          <SearchBar
            onSearch={handleSearch}
            searchResults={searchResults}
            onTrackSelect={handleTrackSelect}
            isSearching={isSearching}
          />
        </div>
      )}
    </div>
  );
};

export default Room;
