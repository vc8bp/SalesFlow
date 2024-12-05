import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('connecting to server');
    await connectDB();
    console.log('connected successfully');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@assetmanager.com' });

    if (adminExists) {
      return NextResponse.json({ message: 'Admin already exists' });
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@assetmanager.com',
      password: 'admin123', // This will be hashed automatically by the User model
      number: '1234567890',
      isAdmin: true,
    });

    return NextResponse.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error in POST /api/setup:', error);
    return NextResponse.json(
      { message: 'Error creating admin user' },
      { status: 500 }
    );
  }
}
