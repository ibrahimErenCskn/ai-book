import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Book, RecommendationRequest } from '@/types';

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Define available model options to try - updated with current model names
const MODEL_OPTIONS = [
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-preview-0514',
  'gemini-1.5-pro',
  'gemini-pro-vision'
];

export async function getBookRecommendations(request: RecommendationRequest): Promise<Book[]> {
  try {
    const { favoriteGenres = [], favoriteBooks = [], limit = 5 } = request;
    
    // Check if API key is available
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }
    
    // Configure the safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Try each model option until one works
    let lastError: Error | null = null;
    for (const modelName of MODEL_OPTIONS) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        // Get the Gemini model
        const model = genAI.getGenerativeModel({
          model: modelName,
          safetySettings,
        });

        // Create a prompt for the Gemini API
        const prompt = `
          I'm looking for book recommendations based on the following preferences:
          ${favoriteGenres.length > 0 ? `Favorite genres: ${favoriteGenres.join(', ')}` : ''}
          ${favoriteBooks.length > 0 ? `Books I've enjoyed: ${favoriteBooks.join(', ')}` : ''}
          
          Please recommend ${limit} books that match these preferences. For each book, provide:
          - Title
          - Author
          - Brief description (1-2 sentences)
          - Genre
          - Publication year (if known)
          
          Format the response as a JSON array of book objects with the following structure:
          {
            "books": [
              {
                "title": "Book Title",
                "author": "Author Name",
                "description": "Brief description",
                "genre": ["Genre1", "Genre2"],
                "publicationYear": 2020
              }
            ]
          }
        `;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw response:', text);
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to parse JSON from Gemini response');
        }
        
        const jsonText = jsonMatch[0];
        const parsedResponse = JSON.parse(jsonText);
        const books = parsedResponse.books || [];

        // Transform the response to match our Book interface
        return books.map((book: any, index: number) => ({
          id: `rec-${Date.now()}-${index}`,
          title: book.title,
          author: book.author,
          description: book.description || '',
          coverImage: `https://picsum.photos/seed/${encodeURIComponent(book.title)}/300/450`, // Placeholder image
          genre: Array.isArray(book.genre) ? book.genre : [book.genre],
          publicationYear: book.publicationYear || book.year,
          rating: book.rating || undefined,
        }));
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        lastError = error as Error;
        // Continue to the next model option
      }
    }

    // If we've tried all models and none worked, throw the last error
    throw lastError || new Error('All model options failed');
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    throw error;
  }
} 