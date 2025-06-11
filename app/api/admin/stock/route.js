import { NextResponse } from 'next/server';
import connectDB from '@/app/libs/mongodb';
import Stock from '@/app/models/stock';

// GET - Ambil semua data stock
export async function GET() {
  try {
    await connectDB();
    const stocks = await Stock.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { message: 'Error fetching stocks' },
      { status: 500 }
    );
  }
}

// POST - Buat data stock baru
export async function POST(request) {
  try {
    await connectDB();
    const { id, name, stock, image } = await request.json();

    // Cek apakah ID sudah ada
    const existingStock = await Stock.findOne({ id });
    if (existingStock) {
      return NextResponse.json(
        { message: 'Product ID already exists' },
        { status: 400 }
      );
    }

    const newStock = new Stock({
      id,
      name,
      stock: parseInt(stock) || 0,
      image
    });

    await newStock.save();
    return NextResponse.json({ stock: newStock }, { status: 201 });
  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json(
      { message: 'Error creating stock' },
      { status: 500 }
    );
  }
}

// PUT - Update stock
export async function PUT(request) {
  try {
    await connectDB();
    const { id, name, stock, image } = await request.json();

    const updatedStock = await Stock.findOneAndUpdate(
      { id },
      { name, stock, image },
      { new: true }
    );

    if (!updatedStock) {
      return NextResponse.json(
        { message: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ stock: updatedStock });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { message: 'Error updating stock' },
      { status: 500 }
    );
  }
}