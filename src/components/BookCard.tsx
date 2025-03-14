import React from 'react';
import { Book } from '@/types';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown, FaStar, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  isDisliked: boolean;
  onFavorite: (book: Book) => void;
  onDislike: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  isFavorite,
  isDisliked,
  onFavorite,
  onDislike,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <p className="text-sm line-clamp-3">{book.description}</p>
          </div>
        </div>
        <Link 
          href={`/books/${book.id}`}
          className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm z-10"
          aria-label="Detayları görüntüle"
        >
          <FaInfoCircle className="text-blue-500 dark:text-blue-400" />
        </Link>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold line-clamp-1 text-gray-800 dark:text-white">{book.title}</h3>
          {book.rating && (
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-500 mr-1 text-xs" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{book.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{book.author}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {book.genre.map((genre) => (
            <span 
              key={genre} 
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            {book.publicationYear && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">
                {book.publicationYear}
              </span>
            )}
            <Link 
              href={`/books/${book.id}`}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
            >
              <span>Detaylar</span>
              <FaInfoCircle className="ml-1" />
            </Link>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onFavorite(book)}
              className={`text-lg p-2 rounded-full transition-all duration-300 ${
                isFavorite 
                  ? 'text-white bg-red-500 hover:bg-red-600' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
            
            <button
              onClick={() => onDislike(book.id)}
              className={`text-lg p-2 rounded-full transition-all duration-300 ${
                isDisliked 
                  ? 'text-white bg-blue-500 hover:bg-blue-600' 
                  : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
              aria-label={isDisliked ? "Remove dislike" : "Dislike"}
            >
              {isDisliked ? <FaThumbsDown /> : <FaRegThumbsDown />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 