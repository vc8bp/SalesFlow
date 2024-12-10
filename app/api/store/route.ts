import Store from "@/models/Store";
import connectDB from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Order from "@/models/Order";
import Product from "@/models/Product";



export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if(!session?.user) return Response.json({error: "access deniled"}, { status: 401 })

    await connectDB();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";

    if (!name) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const customers = await Store.find({
      name: { $regex: name, $options: "i" },
    });

    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) 
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 401 });

    await connectDB();

    const { store, cart } = await req.json();
    const { name, address, number, email } = store;

    if (!name || !address || !number || !email) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Find or create the store
    const customer = await Store.findOneAndUpdate(
      { email },
      { name, address, number, email, salesMan: session.user.id },
      { new: true, upsert: true }
    );

    const products: Array<any> = []

    const orderPromises: any = []
    let total = 0

    await Promise.all(cart.map(async (item: any) => {
      let { _id, size, quantities } = item;

      console.log({ item })
      const product = await Product.findById(_id);
      
      if (!product) throw new Error(`Product with ID ${_id} not found`);

      if (product.quantities[size] < quantities) quantities = product.quantities[size]

      if (quantities > 0) {
        product.quantities[size] -= quantities;
        products.push({
          productId: _id,
          size,
          quantity: quantities,
        })

        total += quantities * product.price
        orderPromises.push(product.save());
      }
    }));

    await Promise.all(orderPromises)


    if (products.length) {
      await Order.create({
        storeId: customer._id,
        product: products,
        createdBy: session.user.id,
        total
      });
    }

    return new Response(
      JSON.stringify({ message: `${products.length} Order created successfully` }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
