// login
import db from "@/app/utils/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const jwtTokenKey = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const query = "SELECT * FROM user WHERE email=?";

    const [rows, fields] = await db.query(query, [email]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const user = rows[0];

    if (password === user.password) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, jwtTokenKey);

      return NextResponse.json({ success: "Login Successful", token });
    } else {
      return NextResponse.json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Internal Server Error" }, 500);
  }
}
