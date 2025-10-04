import { NextRequest, NextResponse } from 'next/server';

// Define user profile type
interface UserProfile {
  id: number;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyGoal: string;
  createdAt: string;
  updatedAt: string;
}

// Temporary in-memory storage for demo purposes
let userData: UserProfile | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, age, gender, height, weight, bodyGoal } = body;

    // Simple validation
    if (!age || !gender || !height || !weight || !bodyGoal) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Store user data in memory (for demo)
    userData = {
      id: userId || 1,
      age: parseInt(age),
      gender,
      height: parseInt(height),
      weight: parseInt(weight),
      bodyGoal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (userData) {
      return NextResponse.json(userData);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}