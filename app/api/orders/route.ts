import connectDB from "@/lib/db";
import Order from "@/models/Order";
import "@/models/Store";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return new Response(JSON.stringify({ error: "Access denied" }), { status: 401 });
      }
  
      await connectDB();
  
      let orders;
      if (session.user.isAdmin) {
        // Admin can fetch all orders, sorted by newest first
        orders = await Order.find()
          .populate("storeId")
          .populate("createdBy")
          .populate({
            path: "product.productId", 
            model: "Product",
            select: "name productNo img price"
          })
          .sort({ createdAt: -1 }); // Sort by newest first
      } else {
        // Non-admins can only fetch their own orders, sorted by newest first
        orders = await Order.find({ createdBy: session.user.id })
          .populate("storeId")
          .populate("createdBy")
          .populate({
            path: "product.productId", 
            model: "Product",
            select: "name productNo img price"
          })
          .sort({ createdAt: -1 }); // Sort by newest first
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