import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";
import connectDB from "../../libs/mongodb";
import Order from "../../models/orderSchema";
import jwt from 'jsonwebtoken';

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT
});

export async function POST(request) {
  try {
    const { items, totalAmount } = await request.json();

    // Membuat ID transaksi unik
    const transactionId = "TX-" + new Date().getTime();

    // === 1. CEK AUTHENTICATION (JWT TOKEN) ===
    let userId = null;
    let userEmail = null;

    const authToken = request.cookies.get('auth-token')?.value;
    if (authToken) {
      try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'your-secret-key');
        userId = decoded.userId;
        userEmail = decoded.email;
        console.log('User authenticated:', userEmail);
      } catch (error) {
        console.log('No valid auth token found, proceeding as guest');
      }
    }

    // === 2. SIAPKAN DATA UNTUK MIDTRANS ===
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
      },
      customer_details: {
        email: userEmail || 'guest@example.com',
        // Tambahkan detail customer lainnya jika diperlukan
      }
    };

    // === 3. BUAT MIDTRANS PAYMENT TOKEN ===
    const paymentToken = await snap.createTransactionToken(parameter);
    console.log('Midtrans payment token created');

    // === 4. SIMPAN ORDER KE DATABASE ===
    await connectDB();

    const newOrder = new Order({
      orderId: transactionId,
      userId: userId,
      userEmail: userEmail,
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
    console.log("Order saved to MongoDB with ID:", transactionId);

    // === 5. RETURN RESPONSE ===
    return NextResponse.json({
      token: paymentToken,
      orderId: transactionId,
      userEmail: userEmail || 'guest'
    });

  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction", details: error.message },
      { status: 500 }
    );
  }
}