import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// It's highly recommended to use environment variables for these details.
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // This query assumes you have an 'events' table with a 'boardroom_id' column.
    // Adjust table/column names to match your database schema.
    const [rows] = await connection.execute(
      "SELECT boardroom_id, COUNT(*) as meeting_count FROM events GROUP BY boardroom_id"
    );

    await connection.end();

    // Transform the data into the { "boardroomId": count } format
    const counts = (rows as { boardroom_id: string; meeting_count: number }[]).reduce((acc, row) => {
      acc[row.boardroom_id] = row.meeting_count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Database Error:', error);
    return new NextResponse('Failed to fetch meeting counts', { status: 500 });
  }
}
