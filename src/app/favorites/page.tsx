'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/types';
import BookList from '@/components/BookList';
import { getUserPreferences, addToDisliked, removeFromFavorites, removeFromDisliked } from '@/lib/userPreferences';
import { FaBook, FaArrowLeft, FaBookOpen, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const { favoriteBooks } = getUserPreferences();
    setFavoriteBooks(favoriteBooks);
  }, []);

  const handleFavorite = (book: Book) => {
    // Since we're in the favorites page, this will remove from favorites
    removeFromFavorites(book.id);
    setFavoriteBooks(prev => prev.filter(b => b.id !== book.id));
  };

  const handleDislike = (bookId: string) => {
    const { dislikedBooks } = getUserPreferences();
    const isDisliked = dislikedBooks.includes(bookId);
    
    if (isDisliked) {
      removeFromDisliked(bookId);
    } else {
      addToDisliked(bookId);
      // Also remove from favorites
      removeFromFavorites(bookId);
      setFavoriteBooks(prev => prev.filter(b => b.id !== bookId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <FaBookOpen className="text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Kitap Önerileri
            </h1>
          </div>
          <Link 
            href="/" 
            className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full transition-all duration-300"
          >
            <FaArrowLeft />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
            <FaHeart className="text-red-500 dark:text-red-300 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Favori Kitaplarım
          </h2>
        </div>

        {isClient ? (
          favoriteBooks.length > 0 ? (
            <BookList
              books={favoriteBooks}
              onFavorite={handleFavorite}
              onDislike={handleDislike}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center max-w-2xl mx-auto">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-flex mb-6">
                <FaBook className="text-blue-500 dark:text-blue-300 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Henüz favori kitabınız bulunmuyor
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Kitap önerileri alarak beğendiğiniz kitapları favorilerinize ekleyebilirsiniz.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <FaBook className="mr-2" />
                Kitap Önerileri Alın
              </Link>
            </div>
          )
        ) : null}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            © 2025 Gemini Kitap Önerileri. Tüm hakları saklıdır.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Hakkımızda
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              İletişim
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 