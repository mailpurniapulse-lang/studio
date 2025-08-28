import type { WeekSchedule } from "@/components/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui-weekly/label";

interface TimetableGridProps {
  schedule: WeekSchedule;
  periodTimes: Array<{ title: string; time: string }>;
  enableBreak: boolean;
  breakAfterPeriod: number;
  enableBreak2: boolean;
  breakAfterPeriod2: number;
  selectedClass: string;
  onCellClick: (day: string, period: number) => void;
  onClassChange: (className: string) => void;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableGrid({ 
  schedule,
  periodTimes,
  enableBreak,
  breakAfterPeriod,
  enableBreak2,
  breakAfterPeriod2,
  selectedClass,
  onCellClick,
  onClassChange
}: TimetableGridProps) {
  
  const renderCell = (day: string, periodIndex: number) => {
    // periodTimes[periodIndex] can be a period or a break
    const period = periodTimes[periodIndex];
    if (period.title.startsWith("Period")) {
      // Find the period number from the title
      const periodNum = parseInt(period.title.replace("Period ", ""));
      const assignment = schedule[day as keyof WeekSchedule]?.[periodNum];
      if (assignment) {
        return (
          <div
            className="h-12 w-full rounded cursor-pointer flex items-center justify-center text-sm font-semibold text-gray-800 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: `${assignment.color}40` }}
            onClick={() => onCellClick(day, periodNum)}
          >
            {assignment.subject}
          </div>
        );
      }
      return (
        <div
          className="h-12 w-full rounded cursor-pointer flex items-center justify-center text-xs font-medium border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-colors"
          onClick={() => onCellClick(day, periodNum)}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (period.title === "Break") {
      return (
        <div className="h-12 w-full rounded flex items-center justify-center text-xs font-medium text-orange-600 bg-orange-50">
          BREAK
        </div>
      );
    } else if (period.title === "Break 2") {
      return (
        <div className="h-12 w-full rounded flex items-center justify-center text-xs font-medium text-blue-600 bg-blue-50">
          BREAK 2
        </div>
      );
    }
    return null;
  };



  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Weekly Timetable</h2>
              <p className="text-sm text-gray-500">Click on cells to assign subjects</p>
            </div>
            <div className="flex items-center space-x-3">
              <Label htmlFor="class-select" className="text-sm font-medium text-gray-700">Class:</Label>
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nursery">Nursery</SelectItem>
                  <SelectItem value="LKG">LKG</SelectItem>
                  <SelectItem value="UKG">UKG</SelectItem>
                  <SelectItem value="Class 1">Class 1</SelectItem>
                  <SelectItem value="Class 2">Class 2</SelectItem>
                  <SelectItem value="Class 3">Class 3</SelectItem>
                  <SelectItem value="Class 4">Class 4</SelectItem>
                  <SelectItem value="Class 5">Class 5</SelectItem>
                  <SelectItem value="Class 6">Class 6</SelectItem>
                  <SelectItem value="Class 7">Class 7</SelectItem>
                  <SelectItem value="Class 8">Class 8</SelectItem>
                  <SelectItem value="Class 9">Class 9</SelectItem>
                  <SelectItem value="Class 10">Class 10</SelectItem>
                  <SelectItem value="Class 11">Class 11</SelectItem>
                  <SelectItem value="Class 12">Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6" id="timetable-container">
          <div className="text-center mb-4 print-title" style={{ display: 'none' }}>
            <h1 className="text-xl font-bold">{selectedClass} - Weekly Timetable</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider w-24">
                    Day
                  </th>
                  {periodTimes.map((period, index) => (
                    <th key={`period-${index + 1}`} className={`border border-gray-300 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider min-w-24 ${period.title === "Break" ? "bg-orange-50 text-orange-800" : period.title === "Break 2" ? "bg-blue-50 text-blue-800" : "text-gray-900"}`}>
                      <div className="flex flex-col">
                        <span>{period.title}</span>
                        <span className={`text-xs font-normal ${period.title === "Break" ? "text-orange-600" : period.title === "Break 2" ? "text-blue-600" : "text-gray-500"}`}>{period.time}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {days.map((day, dayIndex) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      {dayLabels[dayIndex]}
                    </td>
                    {periodTimes.map((period, periodIndex) => (
                      <td key={`${day}-${periodIndex}`} className="border border-gray-300 p-1">
                        {renderCell(day, periodIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
