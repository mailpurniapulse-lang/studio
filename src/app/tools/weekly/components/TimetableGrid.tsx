import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { WeekSchedule } from "../lib/types";


interface TimetableGridProps {
  schedule: WeekSchedule;
  periodTimes: Array<{ title: string; time: string }>;
  enableBreak: boolean;
  breakAfterPeriod: number;
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
  selectedClass,
  onCellClick,
  onClassChange
}: TimetableGridProps) {
  
  const renderCell = (day: string, period: number) => {
    const assignment = schedule[day as keyof WeekSchedule]?.[period];
    
    if (assignment) {
      return (
        <div 
          className="h-12 w-full rounded cursor-pointer flex items-center justify-center text-sm font-semibold text-gray-800 hover:opacity-80 transition-opacity"
          style={{ backgroundColor: `${assignment.color}40` }}
          onClick={() => onCellClick(day, period)}
        >
          {assignment.subject}
        </div>
      );
    }
    
    return (
      <div 
        className="h-12 w-full rounded cursor-pointer flex items-center justify-center text-xs font-medium border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-colors"
        onClick={() => onCellClick(day, period)}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </div>
    );
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
          {/* Heading and class name for export */}
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-900">Weekly Timetable</h2>
            <div className="text-lg font-medium text-primary">{selectedClass}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black-300 px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider w-24">
                    Day
                  </th>
                  {periodTimes.map((period, index) => {
                    const cols = [];
                    
                    cols.push(
                      <th key={`period-${index + 1}`} className="border border-gray-300 px-2 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider min-w-24">
                        <div className="flex flex-col">
                          <span>{period.title}</span>
                          <span className="text-xs font-normal text-gray-500">{period.time}</span>
                        </div>
                      </th>
                    );
                    
                    if (enableBreak && index === breakAfterPeriod - 1) {
                      cols.push(
                        <th key={`break-${index}`} className="border border-gray-300 px-2 py-3 text-center text-xs font-semibold bg-orange-50 text-orange-800 uppercase tracking-wider min-w-24">
                          <div className="flex flex-col">
                            <span>Break</span>
                            <span className="text-xs font-normal text-orange-600">
                              {periodTimes[breakAfterPeriod]?.time.split('-')[1]}-{periodTimes[breakAfterPeriod + 1]?.time.split('-')[0]}
                            </span>
                          </div>
                        </th>
                      );
                    }
                    
                    return cols;
                  }).flat()}
                </tr>
              </thead>
              <tbody className="bg-white">
                {days.map((day, dayIndex) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      {dayLabels[dayIndex]}
                    </td>
                    {Array.from({ length: 8 }, (_, periodIndex) => {
                      const period = periodIndex + 1;
                      const cols = [];
                      
                      cols.push(
                        <td key={`${day}-${period}`} className="border border-gray-300 p-1" data-day={day} data-period={period}>
                          {renderCell(day, period)}
                        </td>
                      );
                      
                      if (enableBreak && period === breakAfterPeriod) {
                        cols.push(
                          <td key={`${day}-break`} className="border border-gray-300 p-1 bg-orange-50">
                            <div className="h-12 w-full rounded flex items-center justify-center text-xs font-medium text-orange-600">
                              BREAK
                            </div>
                          </td>
                        );
                      }
                      
                      return cols;
                    }).flat()}
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
