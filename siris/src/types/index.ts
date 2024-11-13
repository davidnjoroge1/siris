export interface Room {
  id: string;
  name: string;
  createdBy: string;
  currentTrack?: Track;
  participants: { [uid: string]: Participant };
}

export interface Participant {
  uid: string;
  displayName: string;
  role: 'host' | 'participant';
  joinedAt: Date;
}

export interface Track {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}