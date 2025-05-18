import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";
import connectDB from "../../libs/mongodb";
import Order from "../../models/orderSchema";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT
});

export async function POST(request) {
  try {
    const { items, totalAmount } = await request.json();

    // Membuat ID transaksi unik (bisa disesuaikan dengan kebutuhan)
    const transactionId = "TX-" + new Date().getTime();

    // Menyiapkan array item_details untuk Midtrans
    const itemDetails = items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    let parameter = {
      item_details: itemDetails,
      transaction_details: {
        order_id: transactionId,
        gross_amount: totalAmount
      }
    };

    // Create transaction token for Midtrans payment
    const token = await snap.createTransactionToken(parameter);

    // Connect to MongoDB
    await connectDB();

    // Save order to MongoDB
    const newOrder = new Order({
      orderId: transactionId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description || "",
        image: item.image || ""
      })),
      totalAmount,
      status: 'pending'
    });

    await newOrder.save();
    console.log("Order saved to MongoDB");

    return NextResponse.json({ token, orderId: transactionId });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}