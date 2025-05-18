import { NextResponse } from "next/server";
import connectDB from "../../libs/mongodb";
import Order from "../../models/orderSchema";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all orders, sorted by newest first
    // In a real app, you would likely add user authentication and filter by user ID
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}