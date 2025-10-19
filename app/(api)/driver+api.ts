import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { 
      first_name, 
      last_name, 
      clerkId, 
      car_seats, 
      profile_image_url, 
      car_image_url 
    } = await request.json();

    if (!first_name || !last_name || !clerkId || !car_seats) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if driver already exists with this clerk_id
    const existingDriver = await sql`
      SELECT id FROM drivers WHERE clerk_id = ${clerkId}
    `;

    if (existingDriver.length > 0) {
      return Response.json(
        { error: "Driver already exists with this account" },
        { status: 409 },
      );
    }

    const response = await sql`
      INSERT INTO drivers (
        first_name, 
        last_name, 
        clerk_id,
        car_seats,
        profile_image_url,
        car_image_url,
        rating
      ) 
      VALUES (
        ${first_name}, 
        ${last_name}, 
        ${clerkId},
        ${parseInt(car_seats)},
        ${profile_image_url || null},
        ${car_image_url || null},
        5.0
     );`;

    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating driver:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}