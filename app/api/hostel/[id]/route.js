import db from "@/app/db";
import { NextResponse } from "next/server";

// get 1 hostel by id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const resultQuery = "SELECT * FROM hostel WHERE id = ?";
    const imageQuery = "SELECT * FROM images WHERE hostel_id = ?";

    const [hostelResult] = await db.query(resultQuery, [id]);
    const [imagesResult] = await db.query(imageQuery, [id]);

    if (hostelResult.length === 0) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    const hostel = hostelResult[0];

    return NextResponse.json({ result: hostel, images: imagesResult });
  } catch (error) {
    console.error("Error getting hostel:", error);
    return NextResponse.json({ error: "Error getting hostel" }, { status: 500 });
  }
}
