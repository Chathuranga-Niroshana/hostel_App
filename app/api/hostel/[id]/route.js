import db from "@/app/utils/db";
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
export async function DELETE(_, res) {
  try {
    const { id } = await res.params;
    const selectHostelQuery = "SELECT * FROM hostel WHERE id=?";
    const selectImagesQuery = "SELECT * FROM images WHERE hostel_id=?";
    const selectCommentsQuery = "SELECT * FROM comments WHERE hostel_id=?";
    const deleteImagesQuery = "DELETE FROM images WHERE hostel_id=?";
    const deleteCommentsQuery = "DELETE FROM comments WHERE hostel_id=?";
    const deleteHostelQuery = "DELETE FROM hostel WHERE id=?";

    // Select hostel
    const [hostel] = await db.query(selectHostelQuery, [id]);

    if (hostel.length > 0) {
      // Delete related images
      const [imageResults] = await db.query(selectImagesQuery, [id]);
      if (imageResults.length > 0) {
        await db.query(deleteImagesQuery, [id]);
      }
      // Delete related comments
      const [commentResults] = await db.query(selectCommentsQuery, [id]);
      if (commentResults.length > 0) {
        await db.query(deleteCommentsQuery, [id]);
      }
    }

    // Delete hostel
    await db.query(deleteHostelQuery, [id]);

    return NextResponse.json({ message: "Hostel Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json(
      { error: "Error deleting hostel" },
      { status: 500 }
    );
  }
}

// add images to the hostel
export async function POST(req, res) {
  try {
    const { hostelId } = await res.params();
    const { image } = await req.files();
    const imageInsertQuery =
      "INSERT INTO images (hostel_id,image_url) VALUES (?,?) ";
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Error creating hostel" },
      { status: 500 }
    );
  }
}
