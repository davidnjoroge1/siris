// src/components/MusicPlayer/YouTubePlayer.tsx

import React, { useEffect, useRef } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from '../../config/firebase';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  isHost: boolean;
  roomId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, isHost, roomId }) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!isHost) {
      const syncRef = ref(rtdb, `rooms/${roomId}/musicSync`);
      onValue(syncRef, (snapshot) => {
        const syncData = snapshot.val();
        if (syncData && playerRef.current) {
          if (syncData.isPlaying) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
          playerRef.current.seekTo(syncData.currentTime);
        }
      });
    }
  }, [isHost, roomId]);

  const updatePlaybackState = (currentTime: number, isPlaying: boolean) => {
    if (isHost) {
      const syncRef = ref(rtdb, `rooms/${roomId}/musicSync`);
      set(syncRef, {
        currentTime,
        isPlaying,
        lastUpdate: Date.now()
      });
    }
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
  };

  const onStateChange = (event: any) => {
    if (isHost) {
      updatePlaybackState(
        event.target.getCurrentTime(),
        event.data === YouTube.PlayerState.PLAYING
      );
    }
  };

  return (
    <YouTube
      videoId={videoId}
      opts={{
        height: '390',
        width: '640',
        playerVars: {
          controls: isHost ? 1 : 0,
        },
      }}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  );
};

export default YouTubePlayer;