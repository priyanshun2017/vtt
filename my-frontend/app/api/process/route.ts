import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { link } = await request.json();

    if (!link) {
      return NextResponse.json(
        { success: false, message: 'Link is required.' },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: `Process started successfully for: ${link}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
