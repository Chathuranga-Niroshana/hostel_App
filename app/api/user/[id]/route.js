
import db from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(_, res) {
  try {
    const { id } = await res.params;
    const resultQuery = "SELECT * FROM user WHERE id=?";
    const hostelQuery = "SELECT * FROM hostel WHERE owner_id=?";

    const result = await db.query(resultQuery, [id]);
    const hostels = await db.query(hostelQuery, [id]);

    return NextResponse.json({ result,hostels });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Internal Server Error" }, 500);
  }
}
