import { NextResponse } from "next/server";
import connectDB from "../../libs/mongodb";
import Order from "../../models/orderSchema";
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Cek authentication
    const authToken = request.cookies.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    let userId, userEmail;
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key');
      userId = decoded.userId;
      userEmail = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch orders untuk user ini saja
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { userEmail: userEmail }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);

  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}