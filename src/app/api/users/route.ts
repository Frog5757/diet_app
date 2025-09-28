import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory storage for demo purposes
let userData: any = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { age, gender, height, weight, activityLevel, bodyGoal } = body;

    // Simple validation
    if (!age || !gender || !height || !weight || !activityLevel || !bodyGoal) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Store user data in memory (for demo)
    userData = {
      id: 1,
      age: parseInt(age),
      gender,
      height: parseInt(height),
      weight: parseInt(weight),
      activityLevel,
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