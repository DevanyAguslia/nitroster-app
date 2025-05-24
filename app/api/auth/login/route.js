import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/userSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    await connectDB();

    // Tentukan role berdasarkan email domain
    let role;
    if (email.endsWith('@gmail.com')) {
      role = 'customer';
    } else if (email.endsWith('@admin.com')) {
      role = 'staff';
    } else {
      return NextResponse.json(
        { message: "Invalid email domain. Use @gmail.com for customer or @admin.com for staff" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email dan role
    const user = await User.findOne({ email, role });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Buat JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

    // Set token sebagai HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}