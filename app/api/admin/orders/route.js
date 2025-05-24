import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import Order from "../../../models/orderSchema";
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.role !== 'staff') {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}