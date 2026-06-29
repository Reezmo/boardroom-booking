import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'meetings', id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}