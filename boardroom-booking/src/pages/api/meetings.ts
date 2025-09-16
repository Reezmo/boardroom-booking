import type { NextApiRequest, NextApiResponse } from 'next';
// Meeting API is disabled. No meetings are saved or fetched from a database.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(501).json({ message: 'Meeting storage is disabled. Bookings are not saved.' });
}
