import React, { useState } from 'react';
import { FaTimes, FaPlus, FaSearch } from 'react-icons/fa';

// Common book genres
const COMMON_GENRES = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 
  'Romance', 'Historical Fiction', 'Non-fiction', 'Biography', 
  'Self-help', 'Horror', 'Adventure', 'Young Adult', 'Classics',
  'Poetry', 'Drama', 'Crime', 'Dystopian', 'Philosophy', 'Psychology'
];

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
  onGenreRemove: (genre: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  onGenreSelect,
  onGenreRemove,
}) => {
  const [customGenre, setCustomGenre] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredGenres = COMMON_GENRES.filter(
    genre => !selectedGenres.includes(genre) && 
    genre.toLowerCase().includes(customGenre.toLowerCase())
  );

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      onGenreSelect(customGenre.trim());
      setCustomGenre('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomGenre();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedGenres.length > 0 ? (
          selectedGenres.map(genre => (
            <div 
              key={genre}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full shadow-sm hover:shadow transition-all duration-300"
            >
              <span className="text-sm font-medium">{genre}</span>
              <button 
                onClick={() => onGenreRemove(genre)}
                className="ml-1 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                aria-label={`Remove ${genre}`}
              >
                <FaTimes size={10} />
              </button>
            </div>
          ))
        ) : (
          <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm">
            Henüz bir kitap türü seçmediniz. Aşağıdan kitap türleri seçebilir veya ekleyebilirsiniz.
          </div>
        )}
      </div>

      <div className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={customGenre}
              onChange={(e) => {
                setCustomGenre(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Kitap türü ara veya ekle..."
              className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white shadow-sm"
            />
          </div>
          <button
            onClick={handleAddCustomGenre}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-r-xl transition-all duration-300 font-medium flex items-center shadow-sm"
          >
            <FaPlus className="mr-2" />
            Ekle
          </button>
        </div>

        {showSuggestions && filteredGenres.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-auto">
            <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Önerilen türler
            </div>
            {filteredGenres.map(genre => (
              <div
                key={genre}
                className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors flex items-center"
                onClick={() => {
                  onGenreSelect(genre);
                  setCustomGenre('');
                  setShowSuggestions(false);
                }}
              >
                <FaPlus className="text-blue-500 dark:text-blue-400 mr-2 text-xs" />
                <span className="text-gray-800 dark:text-gray-200">{genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreSelector; 