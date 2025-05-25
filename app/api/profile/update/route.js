import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Mock database - replace with your actual database
let users = [
  { id: 1, email: "admin@admin.com", password: "admin123", name: "Admin User", role: "staff" },
  { id: 2, email: "customer@gmail.com", password: "customer123", name: "Customer User", role: "customer" },
];

export async function PUT(request) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get the request body
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find the user
    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = users.find(u => u.email === email && u.id !== decoded.userId);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already taken" },
        { status: 400 }
      );
    }

    // Update the user
    users[userIndex] = {
      ...users[userIndex],
      name: name.trim(),
      email: email.trim()
    };

    // Return the updated user (without password)
    const updatedUser = {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      role: users[userIndex].role
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}