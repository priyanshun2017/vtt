import { NextResponse } from 'next/server';

const usersDB = new Map<string, string>();
usersDB.set('user@example.com', 'password123');
usersDB.set('admin@example.com', 'admin');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const expectedPassword = usersDB.get(email);

    if (expectedPassword === password) {
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
