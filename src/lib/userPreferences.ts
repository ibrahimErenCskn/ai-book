import { Book, UserPreference } from '@/types';

// Local storage keys
const USER_PREFERENCES_KEY = 'ai-book-user-preferences';

// Default user preferences
const defaultUserPreferences: UserPreference = {
  favoriteGenres: [],
  favoriteBooks: [],
  dislikedBooks: [],
};

// Get user preferences from local storage
export function getUserPreferences(): UserPreference {
  if (typeof window === 'undefined') {
    return defaultUserPreferences;
  }

  const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
  if (!storedPreferences) {
    return defaultUserPreferences;
  }

  try {
    return JSON.parse(storedPreferences);
  } catch (error) {
    console.error('Error parsing user preferences:', error);
    return defaultUserPreferences;
  }
}

// Save user preferences to local storage
export function saveUserPreferences(preferences: UserPreference): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
}

// Add a book to favorites
export function addToFavorites(book: Book): void {
  const preferences = getUserPreferences();
  
  // Check if the book is already in favorites
  if (!preferences.favoriteBooks.some(b => b.id === book.id)) {
    preferences.favoriteBooks.push(book);
    
    // Remove from disliked if it was there
    preferences.dislikedBooks = preferences.dislikedBooks.filter(id => id !== book.id);
    
    // Add genres to favorite genres if not already there
    book.genre.forEach(genre => {
      if (!preferences.favoriteGenres.includes(genre)) {
        preferences.favoriteGenres.push(genre);
      }
    });
    
    saveUserPreferences(preferences);
  }
}

// Remove a book from favorites
export function removeFromFavorites(bookId: string): void {
  const preferences = getUserPreferences();
  preferences.favoriteBooks = preferences.favoriteBooks.filter(book => book.id !== bookId);
  saveUserPreferences(preferences);
}

// Add a book to disliked
export function addToDisliked(bookId: string): void {
  const preferences = getUserPreferences();
  
  // Check if the book is already in disliked
  if (!preferences.dislikedBooks.includes(bookId)) {
    preferences.dislikedBooks.push(bookId);
    
    // Remove from favorites if it was there
    preferences.favoriteBooks = preferences.favoriteBooks.filter(book => book.id !== bookId);
    
    saveUserPreferences(preferences);
  }
}

// Remove a book from disliked
export function removeFromDisliked(bookId: string): void {
  const preferences = getUserPreferences();
  preferences.dislikedBooks = preferences.dislikedBooks.filter(id => id !== bookId);
  saveUserPreferences(preferences);
}

// Add a genre to favorites
export function addGenreToFavorites(genre: string): void {
  const preferences = getUserPreferences();
  
  if (!preferences.favoriteGenres.includes(genre)) {
    preferences.favoriteGenres.push(genre);
    saveUserPreferences(preferences);
  }
}

// Remove a genre from favorites
export function removeGenreFromFavorites(genre: string): void {
  const preferences = getUserPreferences();
  preferences.favoriteGenres = preferences.favoriteGenres.filter(g => g !== genre);
  saveUserPreferences(preferences);
}

// Clear all preferences
export function clearPreferences(): void {
  saveUserPreferences(defaultUserPreferences);
} 