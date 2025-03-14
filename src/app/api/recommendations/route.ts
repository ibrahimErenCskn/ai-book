import { NextRequest, NextResponse } from 'next/server';
import { getBookRecommendations } from '@/lib/gemini';
import { RecommendationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    
    // Validate request
    if (!body.favoriteGenres?.length && !body.favoriteBooks?.length) {
      return NextResponse.json(
        { error: 'Please provide at least one favorite genre or book' },
        { status: 400 }
      );
    }
    
    // Get recommendations
    const books = await getBookRecommendations(body);
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

// For demo purposes, also allow GET requests with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genres = searchParams.get('genres');
    const books = searchParams.get('books');
    const limit = searchParams.get('limit');
    
    const requestBody: RecommendationRequest = {
      favoriteGenres: genres ? genres.split(',') : [],
      favoriteBooks: books ? books.split(',') : [],
      limit: limit ? parseInt(limit, 10) : 5,
    };
    
    // Validate request
    if (!requestBody.favoriteGenres?.length && !requestBody.favoriteBooks?.length) {
      return NextResponse.json(
        { error: 'Please provide at least one favorite genre or book' },
        { status: 400 }
      );
    }
    
    // Get recommendations
    const recommendations = await getBookRecommendations(requestBody);
    
    return NextResponse.json({ books: recommendations });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 