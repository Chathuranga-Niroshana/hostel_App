import db from "@/app/db";
import { NextResponse } from "next/server";

// get 1 hostel by id
export async function GET(_, res) {
  try {
    const { id } = await res.params;

    const resultQuery = "SELECT * FROM hostel WHERE id = ?";
    const imageQuery = "SELECT * FROM images WHERE hostel_id = ?";
    const commentQuery = "SELECT * FROM comments WHERE hostel_id = ?";

    const hostelResult = await db.query(resultQuery, [id]);
    const imagesResult = await db.query(imageQuery, [id]);
    const commentResult = await db.query(commentQuery, [id]);

    return NextResponse.json({
      hostel: hostelResult[0],
      images: imagesResult[0],
      comments: commentResult[0],
    });
  } catch (error) {
    console.error("Error getting hostel:", error);
    return NextResponse.json(
      { error: "Error getting hostel" },
      { status: 500 }
    );
  }
}
