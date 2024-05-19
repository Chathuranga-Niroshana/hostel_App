import db from "@/app/db";
import { NextResponse } from "next/server";

// Get all hostels with their images
export async function GET() {
  try {
    const resultQuery = "SELECT * FROM hostel";
    const imageQuery = "SELECT * FROM images";
    const locationQuery = "SELECT * FROM location";

    const [hostelRows, hostelFields] = await db.query(resultQuery);
    const [imageRows, imageFields] = await db.query(imageQuery);
    const locationResults = await db.query(locationQuery);

    // Combine hostel data with images
    const hostelsWithImages = hostelRows.map((hostel) => {
      const images = imageRows.filter((image) => image.hostel_id === hostel.id);
      return {
        ...hostel,
        images: images.map((image) => ({
          image_url: image.image_url,
          image_id: image.image_id,
        })),
      };
    });

    return NextResponse.json({
      result: hostelsWithImages,
      locations: locationResults[0],
    });
  } catch (error) {
    console.error("Error getting hostels with images:", error);
    return NextResponse.json(
      { error: "Error getting hostels with images" },
      { status: 500 }
    );
  }
}

// create hostel
export async function POST(req) {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const resultQuery = `
        INSERT INTO hostel 
        (type, price, owner_id, address, location_id, bed_capacity, available_date, extra, requested, raitings) 
        VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const imageQuery = `
        INSERT INTO images (hostel_id, image_url) 
        VALUES (?,?)`;

    const {
      type,
      price,
      owner_id,
      address,
      location_id,
      bed_capacity,
      available_date,
      extra,
      requested,
      raitings,
      images,
    } = await req.json();

    // Insert the new hostel
    const [newHostelResult] = await connection.query(resultQuery, [
      type,
      price,
      owner_id,
      address,
      location_id,
      bed_capacity,
      available_date,
      extra,
      requested,
      raitings,
    ]);

    const hostelId = newHostelResult.insertId;

    // Insert the images
    for (const imageUrl of images) {
      await connection.query(imageQuery, [hostelId, imageUrl]);
    }

    await connection.commit();
    connection.release();

    return NextResponse.json(
      { success: "Hostel created successfully", hostelId },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Error creating hostel" },
      { status: 500 }
    );
  }
}
