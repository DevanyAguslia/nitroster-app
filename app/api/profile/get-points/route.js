// app/api/profile/get-points/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/userSchema";

export async function POST(request) {
  try {
    const { email } = await request.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      points: user.points || 0
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch points" },
      { status: 500 }
    );
  }
}