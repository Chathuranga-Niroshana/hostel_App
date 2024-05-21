import db from "@/app/db";
import { NextResponse } from "next/server";

// get user
export async function GET(_, res) {
  try {
    const { id } = await res.params;
    const resultQuery = "SELECT * FROM user WHERE id=?";
    const hostelQuery = "SELECT * FROM hostel WHERE owner_id=?";

    const result = await db.query(resultQuery, [id]);
    const hostels = await db.query(hostelQuery, [id]);

    return NextResponse.json({ result: result[0], hostels: hostels[0] });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Internal Server Error" }, 500);
  }
}

// delete user
export async function DELETE(_, res) {
  try {
    const { id } = await res.params;
    const deleteUserQuery = "DELETE FROM user WHERE id=?";
    const selectHostelQuery = "SELECT * FROM hostel WHERE owner_id=?";
    const selectImagesQuery = "SELECT * FROM images WHERE hostel_id=?";
    const selectCommentsQuery = "SELECT * FROM comments WHERE hostel_id=?";
    const deleteImagesQuery = "DELETE FROM images WHERE hostel_id=?";
    const deleteCommentsQuery = "DELETE FROM comments WHERE hostel_id=?";
    const deleteHostelQuery = "DELETE FROM hostel WHERE owner_id=?";

    // Select all hostels owned by the user
    const [hostels] = await db.query(selectHostelQuery, [id]);

    if (hostels.length > 0) {
      for (const hostel of hostels) {
        const hostelId = hostel.id;

        // Delete related images
        const [imageResults] = await db.query(selectImagesQuery, [hostelId]);
        if (imageResults.length > 0) {
          await db.query(deleteImagesQuery, [hostelId]);
        }

        // Delete related comments
        const [commentResults] = await db.query(selectCommentsQuery, [
          hostelId,
        ]);
        if (commentResults.length > 0) {
          await db.query(deleteCommentsQuery, [hostelId]);
        }
      }

      // Delete hostels
      await db.query(deleteHostelQuery, [id]);
    }

    // Delete user
    await db.query(deleteUserQuery, [id]);

    return NextResponse.json({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// update user
export async function PUT(req, res) {
  try {
    const { id } = await res.params;
    const updateQuery =
      "UPDATE user SET username=?, email=?, mobile=?,password=? WHERE id=? ";
    const { username, email, mobile, password } = await req.body;
    const values = [username, email, mobile, password, id];

    const result = await db.query(updateQuery, values);

    return NextResponse.json({ message: "User Updated successfully", result });
  } catch (error) {
    console.error("Error editing user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
