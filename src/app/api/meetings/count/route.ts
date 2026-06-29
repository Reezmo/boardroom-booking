import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'meetings'));
    const counts: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Access the boardroom ID based on how it's saved in the POST route
      const boardroomId = data.boardroom?.id;
      
      if (boardroomId) {
        counts[boardroomId] = (counts[boardroomId] || 0) + 1;
      }
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Failed to fetch meeting counts:', error);
    return NextResponse.json({ message: 'Failed to fetch meeting counts', error: String(error) }, { status: 500 });
  }
}