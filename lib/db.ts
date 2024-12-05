import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log('Connecting to db');
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(1);
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  try {
    console.log(2);
    cached.conn = await cached.promise;
    console.log(3);
  } catch (e) {
    console.log(4);

    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
