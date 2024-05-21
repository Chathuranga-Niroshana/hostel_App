import db from "@/app/utils/db";
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
  try {
    const resultQuery = `
        INSERT INTO hostel 
        (type, price, owner_id, address, location_id, bed_capacity, available_date, extra) 
        VALUES (?,?,?,?,?,?,?,?)`;

    const {
      type,
      price,
      owner_id,
      address,
      location_id,
      bed_capacity,
      available_date,
      extra,
    } = await req.json();

    // Insert the new hostel
    const [newHostelResult] = await db.query(resultQuery, [
      type,
      price,
      owner_id,
      address,
      location_id,
      bed_capacity,
      available_date,
      extra,
    ]);

    return NextResponse.json(
      { success: "Hostel created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Error creating hostel" },
      { status: 500 }
    );
  }
}
