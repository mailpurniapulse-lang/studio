import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timetable } from "@/components/timetable";
import { CalendarCheck } from "lucide-react";

export default function TimetableCreatorPage() {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CalendarCheck /> School Timetable Creator
        </CardTitle>
        <CardDescription>
          Design a weekly timetable for any class. Select subjects, assign teachers, and set period timings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Timetable />
      </CardContent>
    </Card>
  );
}
