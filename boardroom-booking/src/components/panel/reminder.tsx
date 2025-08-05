import { AlertCircle, Clock } from "lucide-react";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';

export default function Reminder() {
  return (
    <div className='mt-6 flex justify-center h-54'>
      <Card className="p-2 shadow-lg shadow-gray rounded-xl w-full max-w-md bg-gradient-to-br from-emerald to-teal-50 border-0 relative">
        {/* Time badge at top right with clock icon */}
        <Badge
          className="absolute top-2 right-4 bg-emerald-100 text-emerald-600 font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border-0"
          variant="secondary"
        >
          <Clock className="w-4 h-4 mr-1 text-emerald-500" />
          16:00 - 17:00
        </Badge>
        <div className="flex items-center gap-3 mt-6">
          {/* Alert icon */}
          <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-400 rounded-full w-10 h-10">
            <AlertCircle className="w-6 h-6" />
          </span>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Upcoming Meeting
          </CardTitle>
        </div>
        <CardContent className="">
          <p className="text-gray-600 text-base">
            Don&#39;t forget your meeting <span className="font-semibold text-emerald-400">Budget Plan</span>
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