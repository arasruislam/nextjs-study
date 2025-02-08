import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/register
export async function POST(request: NextRequest) {
   try {
      const { email, password } = await request.json();
      if (!email || !password) {
         return NextResponse.json(
            { error: "Please provide an email and password" },
            { status: 400 }
         );
      }

      // Connect to database
      await connectToDatabase();

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
         );
      }

      // Create user
      await User.create({ email, password });

      return NextResponse.json(
         { message: "User registered successfully" },
         { status: 201 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: "Something went wrong" },
         { status: 500 }
      );
   }
}
