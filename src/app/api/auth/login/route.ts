import { NextRequest, NextResponse } from 'next/server';

// Define user type
interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

// Shared storage with register route
declare global {
  var usersAuth: User[] | undefined;
}

if (!global.usersAuth) {
  global.usersAuth = [];
}

const usersAuth = global.usersAuth;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = usersAuth.find(u => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
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