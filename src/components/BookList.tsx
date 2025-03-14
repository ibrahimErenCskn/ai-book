import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import { getUserPreferences } from '@/lib/userPreferences';

interface BookListProps {
  books: Book[];
  onFavorite: (book: Book) => void;
  onDislike: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onFavorite, onDislike }) => {
  const { favoriteBooks, dislikedBooks } = getUserPreferences();
  
  // Check if a book is in favorites
  const isBookFavorite = (bookId: string) => {
    return favoriteBooks.some(book => book.id === bookId);
  };
  
  // Check if a book is disliked
  const isBookDisliked = (bookId: string) => {
    return dislikedBooks.includes(bookId);
  };
  
  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No books to display.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={isBookFavorite(book.id)}
          isDisliked={isBookDisliked(book.id)}
          onFavorite={onFavorite}
          onDislike={onDislike}
        />
      ))}
    </div>
  );
};

export default BookList; 