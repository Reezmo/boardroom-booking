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
    const { title, description, agenda, attendees, startTime, endTime, boardroom, organizer } = booking;

    const [result] = await pool.execute(
      'INSERT INTO meetings (title, description, agenda, attendees, startTime, endTime, boardroomId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, agenda, attendees, new Date(startTime), new Date(endTime), boardroom.id, organizer?.uid]
    );

    return NextResponse.json({ message: 'Booking created', id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}
