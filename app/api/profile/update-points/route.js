// app/api/profile/update-points/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import User from "../../../models/userSchema";

export async function POST(request) {
  try {
    const { email, itemCount } = await request.json();

    await connectDB();

    const pointsToAdd = itemCount * 10;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $inc: { points: pointsToAdd } },
      { new: true }
    );

    return NextResponse.json({
      message: "Points updated successfully",
      points: updatedUser.points
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update points" },
      { status: 500 }
    );
  }
}