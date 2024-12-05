import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, number } = body;

    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create salesman
    const user = await User.create({
      name,
      email,
      password,
      number,
      isAdmin: false,
    });

    return NextResponse.json({ message: 'Salesman created successfully' });
  } catch (error) {
    console.error('Error in POST /api/admin/salesmen:', error);
    return NextResponse.json(
      { message: 'Error creating salesman' },
      { status: 500 }
    );
  }
}
