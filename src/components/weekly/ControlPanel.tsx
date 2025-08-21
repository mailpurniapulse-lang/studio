import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { presetSubjects } from "@/lib/plangen/subjects";
import type { CustomSubject } from "@/lib/plangen/types";

interface ControlPanelProps {
  startTime: string;
  setStartTime: (time: string) => void;
  periodDuration: number;
  setPeriodDuration: (duration: number) => void;
  enableBreak: boolean;
  setEnableBreak: (enabled: boolean) => void;
  breakAfterPeriod: number;
  setBreakAfterPeriod: (period: number) => void;
  breakDuration: number;
  setBreakDuration: (duration: number) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  customSubjectName: string;
  setCustomSubjectName: (name: string) => void;
  customSubjects: CustomSubject[];
  onAddCustomSubject: (subject: CustomSubject) => void;
  onClearTimetable: () => void;
}

export default function ControlPanel({
  startTime,
  setStartTime,
  periodDuration,
  setPeriodDuration,
  enableBreak,
  setEnableBreak,
  breakAfterPeriod,
  setBreakAfterPeriod,
  breakDuration,
  setBreakDuration,
  selectedSubject,
  setSelectedSubject,
  customSubjectName,
  setCustomSubjectName,
  customSubjects,
  onAddCustomSubject,
  onClearTimetable,
}: ControlPanelProps) {
  
  return (
    <div className="lg:w-80 space-y-6">
      {/* Subject Management */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject-select">Select Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                <div className="text-xs font-semibold text-gray-500 px-2 py-1">Core Subjects</div>
                {presetSubjects.slice(0, 6).map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span>{subject.name}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="text-xs font-semibold text-gray-500 px-2 py-1">Specialized Subjects</div>
                {presetSubjects.slice(6, 14).map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span>{subject.name}</span>
                    </div>
                  </SelectItem>
                ))}
                {customSubjects.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1">Custom Subjects</div>
                    {customSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: subject.color }}
                          />
                          <span>{subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="custom-subject">Add Custom Subject</Label>
            <div className="flex space-x-2">
              <Input
                id="custom-subject"
                value={customSubjectName}
                onChange={(e) => setCustomSubjectName(e.target.value)}
                placeholder="Subject name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customSubjectName.trim()) {
                    onAddCustomSubject({
                      id: crypto.randomUUID(),
                      name: customSubjectName.trim(),
                      color: '#8884d8'
                    });
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() =>
                  customSubjectName.trim() &&
                  onAddCustomSubject({
                    id: crypto.randomUUID(),
                    name: customSubjectName.trim(),
                    color: '#8884d8'
                  })
                }
                disabled={!customSubjectName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Time Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="period-duration">Period Duration (minutes)</Label>
            <Input
              id="period-duration"
              type="number"
              min="30"
              max="120"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-break"
              checked={enableBreak}
              onCheckedChange={(checked) => setEnableBreak(checked as boolean)}
            />
            <Label htmlFor="enable-break">Enable Break</Label>
          </div>

          {enableBreak && (
            <>
              <div>
                <Label htmlFor="break-after">Break After Period</Label>
                <Select 
                  value={String(breakAfterPeriod)} 
                  onValueChange={(value) => setBreakAfterPeriod(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2,3,4,5,6].map((period) => (
                      <SelectItem key={period} value={String(period)}>
                        After Period {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                <Input
                  id="break-duration"
                  type="number"
                  min="5"
                  max="60"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onClearTimetable}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Timetable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}