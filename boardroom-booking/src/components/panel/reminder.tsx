import React from 'react';
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card'

export default function Reminder() {
  return (
    <div className='mt-6 flex justify-center h-55'>
      <Card className="p-6 shadow-lg shadow-gray-200/60 rounded-xl w-full max-w-md bg-gradient-to-br from-emerald to-white-50 border-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-400 rounded-full w-10 h-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Upcoming Meeting
          </CardTitle>
        </div>
        <CardContent className="">
          <p className="text-gray-600 text-base">
            Don&#39;t forget your meeting at <span className="font-semibold text-emerald-400">3:00 PM</span>
          </p>
        </CardContent>
        <CardFooter className='flex justify-start gap-3'>
          <Button
            variant="outline"
            className="rounded-lg px-5 font-medium shadow">
            View
          </Button>
          <Button
            variant="outline"
            className="rounded-lg px-5 font-medium border-gray-300 ">
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
