import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'meetings'));
    const meetings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate(),
      };
    });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return NextResponse.json({ message: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    
    const { title, description, agenda, attendees, startTime, endTime, boardroom, userId } = booking;

    const newMeeting = {
      title,
      description: description || "",
      agenda: agenda || "",
      attendees: attendees || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      boardroom: boardroom, 
      userId: userId || null,
      IsConfirmed: true
    };

    const docRef = await addDoc(collection(db, 'meetings'), newMeeting);

    return NextResponse.json({ id: docRef.id, ...newMeeting }, { status: 201 });
  } catch (error) {

    console.error('Failed to create booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}