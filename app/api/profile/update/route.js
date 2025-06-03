import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Mock database - replace with your actual database
let users = [
  { id: "683c1abcda66f8c172e55318", email: "admin@admin.com", password: "admin123", name: "Admin User", role: "staff" },
  { id: "683c1abcda66f8c172e55319", email: "customer@gmail.com", password: "customer123", name: "Customer User", role: "customer" },
];

export async function PUT(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded JWT:", decoded);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hanya ubah name saja
    users[userIndex].name = name.trim();

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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
