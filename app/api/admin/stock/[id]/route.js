import { NextResponse } from 'next/server';
import connectDB from '@/app/libs/mongodb';
import Stock from '@/app/models/stock';

// PATCH - Update stock quantity
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { action, amount } = await request.json();

    const stockItem = await Stock.findOne({ id });
    if (!stockItem) {
      return NextResponse.json(
        { message: 'Stock not found' },
        { status: 404 }
      );
    }

    let newStock = stockItem.stock;
    if (action === 'add') {
      newStock += amount;
    } else if (action === 'subtract') {
      newStock = Math.max(0, newStock - amount);
    }

    const updatedStock = await Stock.findOneAndUpdate(
      { id },
      { stock: newStock },
      { new: true }
    );

    return NextResponse.json({ stock: updatedStock });
  } catch (error) {
    console.error('Error updating stock quantity:', error);
    return NextResponse.json(
      { message: 'Error updating stock quantity' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus stock item
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedStock = await Stock.findOneAndDelete({ id });
    if (!deletedStock) {
      return NextResponse.json(
        { message: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json(
      { message: 'Error deleting stock' },
      { status: 500 }
    );
  }
}