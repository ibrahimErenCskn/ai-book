'use client';

import React, { useEffect, useState } from 'react';
import { Book } from '@/types';
import { getUserPreferences, addToFavorites, removeFromFavorites, addToDisliked, removeFromDisliked } from '@/lib/userPreferences';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown, FaStar, FaArrowLeft, FaBookOpen, FaCalendarAlt, FaUser, FaTags, FaRobot } from 'react-icons/fa';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useParams } from 'next/navigation';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isAiRecommended, setIsAiRecommended] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // In a real app, you would fetch the book details from an API
        // For now, we'll simulate this by getting the book from localStorage if it exists
        const userPrefs = getUserPreferences();
        const foundBook = userPrefs.favoriteBooks.find(book => book.id === bookId);
        
        if (foundBook) {
          setBook(foundBook);
        } else {
          // Simulate API call to get book details
          // In a real app, you would fetch from your backend
          const response = await fetch(`/api/books/${bookId}`);
          if (!response.ok) {
            throw new Error('Kitap detayları alınamadı');
          }
          const data = await response.json();
          setBook(data.book);
          
          // Check if this is an AI recommended book
          if (bookId.startsWith('rec-')) {
            setIsAiRecommended(true);
          }
        }

        // Check if book is in favorites or disliked
        const { favoriteBooks, dislikedBooks } = getUserPreferences();
        setIsFavorite(favoriteBooks.some(book => book.id === bookId));
        setIsDisliked(dislikedBooks.includes(bookId));
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Kitap detayları alınamadı. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleFavorite = () => {
    if (!book) return;
    
    if (isFavorite) {
      removeFromFavorites(book.id);
      setIsFavorite(false);
    } else {
      addToFavorites(book);
      setIsFavorite(true);
      // If the book was disliked, remove it from disliked
      if (isDisliked) {
        removeFromDisliked(book.id);
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (!book) return;
    
    if (isDisliked) {
      removeFromDisliked(book.id);
      setIsDisliked(false);
    } else {
      addToDisliked(book.id);
      setIsDisliked(true);
      // If the book was favorited, remove it from favorites
      if (isFavorite) {
        removeFromFavorites(book.id);
        setIsFavorite(false);
      }
    }
  };

  // Fallback content for when the book is not found
  const renderFallbackContent = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center max-w-2xl mx-auto">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full inline-flex mb-6">
        <FaBookOpen className="text-blue-500 dark:text-blue-300 text-3xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Kitap bulunamadı
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Aradığınız kitap bulunamadı veya bir hata oluştu.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
      >
        <FaArrowLeft className="mr-2" />
        Ana Sayfaya Dön
      </Link>
    </div>
  );

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
          <div className="flex space-x-3">
            <Link 
              href="/favorites" 
              className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/40 text-red-600 dark:text-red-300 px-4 py-2 rounded-full transition-all duration-300"
            >
              <FaHeart />
              <span>Favorilerim</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full transition-all duration-300"
            >
              <FaArrowLeft />
              <span>Ana Sayfa</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" text="Kitap detayları yükleniyor..." />
          </div>
        ) : error || !book ? (
          renderFallbackContent()
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {isAiRecommended && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 text-center">
                <div className="flex items-center justify-center">
                  <FaRobot className="mr-2" />
                  <span>Bu kitap Gemini AI tarafından önerilmiştir</span>
                </div>
              </div>
            )}
            <div className="md:flex">
              {/* Book Cover Image */}
              <div className="md:w-1/3 relative">
                <div className="h-96 md:h-full w-full relative">
                  <img
                    src={book.coverImage}
                    alt={`${book.title} cover`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                </div>
                <div className="absolute bottom-4 left-4 md:hidden flex space-x-3">
                  <button
                    onClick={handleFavorite}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
                    }`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                      isDisliked 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500'
                    }`}
                    aria-label={isDisliked ? "Remove dislike" : "Dislike"}
                  >
                    {isDisliked ? <FaThumbsDown className="text-xl" /> : <FaRegThumbsDown className="text-xl" />}
                  </button>
                </div>
              </div>
              
              {/* Book Details */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{book.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{book.author}</p>
                  </div>
                  {book.rating && (
                    <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-full">
                      <FaStar className="text-yellow-500 mr-2" />
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">{book.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="hidden md:flex space-x-3 mb-6">
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 ${
                      isFavorite 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                    }`}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    <span>{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 ${
                      isDisliked 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-300'
                    }`}
                  >
                    {isDisliked ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    <span>{isDisliked ? 'Beğenmediğim Kitaplardan Çıkar' : 'Beğenmedim'}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-2" />
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Yayın Yılı</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{book.publicationYear || 'Belirtilmemiş'}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaUser className="text-blue-500 dark:text-blue-400 mr-2" />
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Yazar</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg md:col-span-2">
                    <div className="flex items-center mb-2">
                      <FaTags className="text-blue-500 dark:text-blue-400 mr-2" />
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">Türler</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.genre.map((genre) => (
                        <span 
                          key={genre} 
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Kitap Hakkında</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {book.description || 'Bu kitap için açıklama bulunmamaktadır.'}
                  </p>
                </div>
                
                {/* Additional book details can be added here */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Benzer Kitaplar</h3>
                  {isAiRecommended ? (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Bu kitap, Gemini AI tarafından tercihlerinize göre önerilmiştir. Daha fazla kitap önerisi almak için ana sayfaya dönebilirsiniz.
                      </p>
                      <Link 
                        href="/" 
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        <FaRobot className="mr-2" />
                        <span>Daha Fazla Öneri Al</span>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      Bu kitaba benzer kitaplar için ana sayfadan öneriler alabilirsiniz.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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