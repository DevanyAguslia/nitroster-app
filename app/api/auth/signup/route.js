import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/userSchema";
import bcrypt from 'bcryptjs';

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

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}