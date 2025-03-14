import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Log the API key (first few characters for debugging)
    console.log('API Key starts with:', apiKey.substring(0, 5) + '...');
    
    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List of models to try
    const modelOptions = [
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro',
      'models/gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.0-pro'
    ];
    
    // Try each model
    const results = [];
    
    for (const modelName of modelOptions) {
      try {
        console.log(`Testing model: ${modelName}`);
        
        // Try to create a model
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Try a simple generation
        const result = await model.generateContent('Hello, what is your name?');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          status: 'success',
          response: text.substring(0, 100) + (text.length > 100 ? '...' : '')
        });
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        results.push({
          model: modelName,
          status: 'error',
          error: (error as Error).message
        });
      }
    }
    
    return NextResponse.json({
      apiKeyConfigured: true,
      apiKeyPrefix: apiKey.substring(0, 5) + '...',
      results
    });
  } catch (error) {
    console.error('Error in test-gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to test Gemini API', details: (error as Error).message },
      { status: 500 }
    );
  }
} 