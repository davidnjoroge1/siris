import React from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={onPrevious}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <SkipBack className="w-6 h-6" />
      </button>
      
      <button
        onClick={onPlayPause}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        {isPlaying ? (
          <PauseCircle className="w-8 h-8" />
        ) : (
          <PlayCircle className="w-8 h-8" />
        )}
      </button>
      
      <button
        onClick={onNext}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlayerControls;