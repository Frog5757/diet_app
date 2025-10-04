import { NextRequest, NextResponse } from 'next/server';

// Define user type
interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

// Shared global storage for demo purposes
declare global {
  var usersAuth: User[] | undefined;
  var nextUserId: number | undefined;
}

if (!global.usersAuth) {
  global.usersAuth = [];
}

if (!global.nextUserId) {
  global.nextUserId = 1;
}

const usersAuth = global.usersAuth;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, profile } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate profile if provided
    if (profile && (!profile.age || !profile.gender || !profile.height || !profile.weight || !profile.bodyGoal)) {
      return NextResponse.json(
        { error: 'All profile fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = usersAuth.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: global.nextUserId!++,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
    };

    usersAuth.push(newUser);

    // Save profile data if provided
    if (profile) {
      try {
        const profileResponse = await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: newUser.id,
            ...profile
          }),
        });

        if (!profileResponse.ok) {
          console.error('Failed to save profile data');
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }

    // Return user without password
    const { password: _p, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}