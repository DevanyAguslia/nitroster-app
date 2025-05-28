import { NextResponse } from 'next/server';
import connectDB from '@/app/libs/mongodb';
import Stock from '@/app/models/stock';

// POST - Initialize dummy data
export async function POST() {
  try {
    await connectDB();

    // Cek apakah data sudah ada
    const existingStocks = await Stock.countDocuments();
    if (existingStocks > 0) {
      return NextResponse.json(
        { message: 'Stock data already exists' },
        { status: 400 }
      );
    }

    const initialData = [
      {
        id: 'INO001',
        name: 'Nitro Coffee Beans',
        stock: 9,
        image: '☕'
      },
      {
        id: 'INO002',
        name: 'Premium Black Tea',
        stock: 25,
        image: '🍵'
      },
      {
        id: 'INO003',
        name: 'Full Cream Honey Milk',
        stock: 0,
        image: '🥛'
      },
      {
        id: 'INO004',
        name: 'Nitro Tin Container',
        stock: 4,
        image: '🥫'
      },
      {
        id: 'INO005',
        name: 'Fresh Mint Leaves',
        stock: 0,
        image: '🌿'
      }
    ];

    await Stock.insertMany(initialData);
    return NextResponse.json({
      message: 'Initial stock data created successfully',
      count: initialData.length
    });
  } catch (error) {
    console.error('Error initializing stock data:', error);
    return NextResponse.json(
      { message: 'Error initializing stock data' },
      { status: 500 }
    );
  }
}