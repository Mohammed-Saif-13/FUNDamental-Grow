import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    console.log("Signup attempt:", { name, email, phone }); // Debug log

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();
    console.log("DB connected"); // Debug log

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 422 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed"); // Debug log

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: "user",
    });

    console.log("User created:", user._id); // Debug log

    return NextResponse.json(
      {
        message: "Account created successfully!",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
