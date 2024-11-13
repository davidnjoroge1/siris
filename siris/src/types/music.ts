export interface Track {
    id: string;
    title: string;
    artist: string;
    thumbnailUrl: string;
    duration: number;
    videoId: string;
  }
  
  export interface PlaybackState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
  }
  