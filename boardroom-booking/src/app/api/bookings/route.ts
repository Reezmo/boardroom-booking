import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { IEvent } from '@/models/IEvent';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM meetings');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return NextResponse.json({ message: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
        const { title, description, agenda, attendees, startTime, endTime, boardroomId, organizer } = booking;

    // Assuming 'organizer' is the user's email, we need to find the user's ID.
    // This is a placeholder. You'll need to implement logic to get the user ID from the session or email.
    // For now, let's assume we can fetch it or it's passed differently.
    // If you have user authentication, you should get the user ID from the session.
    // For now, I'll make a placeholder query. This part might need adjustment based on your user management.

    // A simple (and insecure) way to get userId from email for now.
    // In a real app, you'd get this from a secure session.
    let userId = null;
    if (organizer) {
      const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [organizer]);
      const users = userRows as any[];
      if (users.length > 0) {
        userId = users[0].id;
      } else {
        // If user not found, create a new one. Useful for local dev.
        const [newUserResult] = await pool.execute('INSERT INTO users (email) VALUES (?)', [organizer]);
        const newUserInsertResult = newUserResult as any;
        userId = newUserInsertResult.insertId;
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO meetings (title, description, agenda, attendees, startTime, endTime, boardroomId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, agenda, attendees, new Date(startTime), new Date(endTime), boardroomId, userId]
    );

    const insertResult = result as any;
    const newEventId = insertResult.insertId;

    // Fetch the newly created event to return it
    const [newEventRows] = await pool.query('SELECT * FROM meetings WHERE id = ?', [newEventId]);
    const newEvent = (newEventRows as any)[0];

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}
