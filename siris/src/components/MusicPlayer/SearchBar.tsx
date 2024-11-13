import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Track } from '../../types/music';

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  onTrackSelect: (track: Track) => void;
  searchResults: Track[];
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onTrackSelect,
  searchResults
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs..."
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Search className="w-5 h-5 text-gray-400" />
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searchResults.map((track) => (
            <button
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
            >
              <img
                src={track.thumbnailUrl}
                alt={track.title}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;