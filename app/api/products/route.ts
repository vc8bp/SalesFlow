import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import mongoose from 'mongoose';



export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    let products = null
    if(id) {
      if(!mongoose.isValidObjectId(id)) return Response.json({message: "Not a valid Product id!!"}, { status: 400})
      products = await Product.findById(id)
      if(products == null) return Response.json({message: "Product not found!!"}, { status: 404})
    }
    else products = await Product.find({});

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadImageToCloudinary(file: File, productNo: string,): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        public_id: `${productNo}`, 
        resource_type: "auto", 
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const fileStream = Readable.from(file.stream());
    fileStream.pipe(stream);
  });
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const productNo = formData.get('productNo') as string;
  const price = formData.get('price') as string;
  const darkQuantity = formData.get('dark-quantity') as string;
  const lightQuantity = formData.get('light-quantity') as string;
  const image = formData.get('image') as File | null; 
  const productId = formData.get('id') as string; 
  try {
    await connectDB();

    if (productId) {
      // Update existing product
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return new NextResponse(
          JSON.stringify({ error: 'Product not found' }),
          { status: 404 }
        );
      }

      // Update fields
      existingProduct.name = name || existingProduct.name;
      existingProduct.productNo = productNo || existingProduct.productNo;
      existingProduct.price = price ? parseFloat(price) : existingProduct.price;
      existingProduct.quantities = {
        dark: darkQuantity
          ? parseInt(darkQuantity, 10)
          : existingProduct.quantities.dark,
        light: lightQuantity
          ? parseInt(lightQuantity, 10)
          : existingProduct.quantities.light,
      };

      if (image) {
        const imageUrl = await uploadImageToCloudinary(image, productNo);
        existingProduct.img = imageUrl;
      }

      await existingProduct.save();

      return new NextResponse(
        JSON.stringify({
          message: 'Product updated successfully!',
          product: existingProduct,
        }),
        { status: 200 }
      );
    } else {
      // Create a new product
      if (!name || !productNo || !price || !darkQuantity || !lightQuantity || !image) {
        return new NextResponse(
          JSON.stringify({ error: 'All fields are required' }),
          { status: 400 }
        );
      }

      const imageUrl = await uploadImageToCloudinary(image, productNo);

      const productData = {
        name,
        productNo,
        quantities: {
          dark: parseInt(darkQuantity, 10),
          light: parseInt(lightQuantity, 10),
        },
        price: parseFloat(price),
        img: imageUrl,
      };

      const newProduct = new Product(productData);
      await newProduct.save();

      return new NextResponse(
        JSON.stringify({
          message: 'Product created successfully!',
          product: productData,
        }),
        { status: 200 }
      );
    }
  } catch (uploadError: any) {
    console.log({ code: uploadError?.code });
    if (uploadError?.code === 11000) {
      return new NextResponse(
        JSON.stringify({ error: 'Product with this number already exists' }),
        { status: 409 }
      );
    }

    console.error('Error:', uploadError);
    return new NextResponse(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500 }
    );
  }
}
