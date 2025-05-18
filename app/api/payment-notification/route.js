import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import Order from "../../../models/orderSchema";

export async function POST(request) {
  try {
    const notification = await request.json();
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Payment notification received for order ${orderId}`);

    // Connect to MongoDB
    await connectDB();

    // Find the order in the database
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status based on Midtrans transaction status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept') {
        // Payment success and accepted
        order.status = 'paid';
      }
    } else if (transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire') {
      // Payment failed
      order.status = 'cancelled';
    } else if (transactionStatus === 'pending') {
      // Payment pending
      order.status = 'pending';
    }

    await order.save();
    console.log(`Order ${orderId} status updated to ${order.status}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return NextResponse.json(
      { success: false, message: "Error processing notification" },
      { status: 500 }
    );
  }
}