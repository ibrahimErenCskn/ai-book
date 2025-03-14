export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string[];
  rating?: number;
  publicationYear?: number;
}

export interface UserPreference {
  favoriteGenres: string[];
  favoriteBooks: Book[];
  dislikedBooks: string[]; // IDs of disliked books
}

export interface RecommendationRequest {
  favoriteGenres?: string[];
  favoriteBooks?: string[];
  limit?: number;
}

export interface RecommendationResponse {
  books: Book[];
  message?: string;
} 