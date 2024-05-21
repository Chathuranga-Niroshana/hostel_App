import db from "@/app/utils/db";
import { NextResponse } from "next/server";

// create a user
export async function POST(request) {
  try {
    const newUserQuery =
      "INSERT INTO user (`username`, `email`, `password`, `mobile`) VALUES (?, ?, ?, ?)";

    const { username, email, password, mobile } = await request.json();

    const result = await db.query(newUserQuery, [
      username,
      email,
      password,
      mobile,
    ]);

    return NextResponse.json({ message: "User Created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating user" }, 500);
  }
}
