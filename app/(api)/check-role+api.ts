import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const { clerkId } = await request.json();

    if (!clerkId) {
      return Response.json(
        { error: "Missing clerkId" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Check if user exists in drivers table
    const driverCheck = await sql`
      SELECT id FROM drivers WHERE clerk_id = ${clerkId}
    `;

    if (driverCheck.length > 0) {
      return Response.json({ 
        role: "driver",
        exists: true 
      });
    }

    // Check if user exists in users table
    const userCheck = await sql`
      SELECT id FROM users WHERE clerk_id = ${clerkId}
    `;

    if (userCheck.length > 0) {
      return Response.json({ 
        role: "user",
        exists: true 
      });
    }

    // User doesn't exist in either table
    return Response.json({ 
      role: null,
      exists: false 
    });

  } catch (error) {
    console.error("Error checking user role:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
