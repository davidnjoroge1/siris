import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="relative w-full h-1 bg-gray-200 rounded">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleChange}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <div 
          className="h-full bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;