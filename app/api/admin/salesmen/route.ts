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



export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 401 });
    }

    await connectDB();

    let orders;
    if (session.user.isAdmin) {
      orders = await User.find().sort({ createdAt: -1 }); 
    } else {
      orders = await User.find({ createdBy: session.user.id }).sort({ createdAt: -1 });
    }

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}