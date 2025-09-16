import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
  }

  try {
    const [result] = await pool.execute('DELETE FROM meetings WHERE id = ?', [id]);
    
    const deleteResult = result as any;

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
