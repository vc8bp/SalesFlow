import connectDB from "@/lib/db";
import Order from "@/models/Order";
import "@/models/Store";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import "@/models/Product";

export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return Response.json({ error: "Access denied" }, { status: 401 });
      }
  
      await connectDB();

      console.log({session: session.user})
  
      let orders;
      if (session.user.isAdmin || session.user.isManager) {
        orders = await Order.find()
          .populate("storeId")
          .populate("createdBy")
          .populate({
            path: "product.productId", 
            model: "Product",
            select: "name productNo img price"
          })
          .populate({
            path: "remark.by",
            model: "User",
            select: "name", 
          })
          .sort({ createdAt: -1 }); 
      } else {
        orders = await Order.find({ createdBy: session.user.id })
          .populate("storeId")
          .populate("createdBy")
          .populate({
            path: "product.productId", 
            model: "Product",
            select: "name productNo img price"
          })
          .populate({
            path: "remark.by",
            model: "User",
            select: "name",
          })
          .sort({ createdAt: -1 }); 
      }
  
      return Response.json(orders, { status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return Response.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }



  export async function PUT(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user || !session?.user.isManager) {
        return Response.json({ error: "Access denied" }, { status: 401 });
      }
  
      await connectDB();
  
      const body = await req.json();
      const { orderId, status, message } = body;
  
      if (!orderId || !status || !message) {
        return Response.json({ error: "Order ID, status, and message are required" }, { status: 400 });
      }
  
      const validStatuses = ["Pending", "Conformed"];
      if (!validStatuses.includes(status)) {
        return Response.json({ error: "Invalid status value" }, { status: 400 });
      }
  
      const order = await Order.findById(orderId);
  
      if (!order) {
        return Response.json({ error: "Order not found" }, { status: 404 });
      }
  
      order.remark.push({
        by: session.user.id,
        message,
        status,
      });
  
      order.status = status;
  
      await order.save();
  
      return Response.json(
        { message: "Order status and remarks updated successfully", order },
        { status: 200 }
      );
    } catch (error) {
      console.log(error)
      console.error("Error updating order status and adding remark:", error);
      return Response.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  