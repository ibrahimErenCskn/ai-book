'use client';

import React, { useState } from 'react';
import { Book, RecommendationRequest } from '@/types';
import GenreSelector from '@/components/GenreSelector';
import BookList from '@/components/BookList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { addToFavorites, addToDisliked, removeFromDisliked, removeFromFavorites } from '@/lib/userPreferences';
import { FaBook, FaHeart, FaSearch, FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customBookTitle, setCustomBookTitle] = useState('');
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenres(prev => [...prev, genre]);
  };

  const handleGenreRemove = (genre: string) => {
    setSelectedGenres(prev => prev.filter(g => g !== genre));
  };

  const handleAddCustomBook = () => {
    if (customBookTitle.trim()) {
      // In a real app, you might want to validate this against a book database
      setCustomBookTitle('');
    }
  };

  const handleGetRecommendations = async () => {
    if (selectedGenres.length === 0) {
      setError('Lütfen en az bir kitap türü seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: RecommendationRequest = {
        favoriteGenres: selectedGenres,
        favoriteBooks: [],
        limit: 8,
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Öneriler alınamadı');
      }

      const data = await response.json();
      setRecommendations(data.books);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Öneriler alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = (book: Book) => {
    addToFavorites(book);
    // Force a re-render
    setRecommendations([...recommendations]);
  };

  const handleDislike = (bookId: string) => {
    // Check if the book is already disliked
    const isDisliked = recommendations.some(book => 
      book.id === bookId && addToDisliked(bookId)
    );
    
    if (isDisliked) {
      removeFromDisliked(bookId);
    } else {
      addToDisliked(bookId);
    }
    
    // Force a re-render
    setRecommendations([...recommendations]);
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
            href="/favorites" 
            className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full transition-all duration-300"
          >
            <FaHeart />
            <span>Favorilerim</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <FaSearch className="text-blue-500 dark:text-blue-300 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Kitap Türlerini Seçin
            </h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              İlgilendiğiniz kitap türlerini seçerek size özel kitap önerileri alın.
            </p>
            <GenreSelector
              selectedGenres={selectedGenres}
              onGenreSelect={handleGenreSelect}
              onGenreRemove={handleGenreRemove}
            />
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleGetRecommendations}
              disabled={isLoading || selectedGenres.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" text="" />
                  <span className="ml-2">Öneriler Alınıyor...</span>
                </>
              ) : (
                'Kitap Önerileri Al'
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </section>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" text="Kitap önerileri alınıyor..." />
          </div>
        ) : recommendations.length > 0 ? (
          <section className="mb-12">
            <div className="flex items-center mb-8">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <FaBook className="text-purple-500 dark:text-purple-300 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Sizin İçin Önerilen Kitaplar
              </h2>
            </div>
            <BookList
              books={recommendations}
              onFavorite={handleFavorite}
              onDislike={handleDislike}
            />
          </section>
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
