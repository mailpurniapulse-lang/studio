import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui-weekly/label";
import { Input } from "@/components/ui-weekly/input";
import { Button } from "@/components/ui-weekly/button";
import { Checkbox } from "@/components/ui-weekly/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, Plus } from "lucide-react";
import { presetSubjects } from "@/lib/weekly/subjects";
import type { CustomSubject } from "@/components/schema";

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
  // Second break props
  enableBreak2: boolean;
  setEnableBreak2: (enabled: boolean) => void;
  breakAfterPeriod2: number;
  setBreakAfterPeriod2: (period: number) => void;
  breakDuration2: number;
  setBreakDuration2: (duration: number) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  customSubjectName: string;
  setCustomSubjectName: (name: string) => void;
  customSubjects: CustomSubject[];
  onAddCustomSubject: () => void;
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
  enableBreak2,
  setEnableBreak2,
  breakAfterPeriod2,
  setBreakAfterPeriod2,
  breakDuration2,
  setBreakDuration2,
  selectedSubject,
  setSelectedSubject,
  customSubjectName,
  setCustomSubjectName,
  customSubjects,
  onAddCustomSubject,
  onClearTimetable,
}: ControlPanelProps) {
  
  const allSubjects = [...presetSubjects, ...customSubjects];

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
                <div className="text-xs font-semibold text-gray-500 px-2 py-1">Sciences</div>
                {presetSubjects.slice(14, 17).map((subject) => (
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
                <div className="text-xs font-semibold text-gray-500 px-2 py-1">Arts & Others</div>
                {presetSubjects.slice(17).map((subject) => (
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
                onKeyPress={(e) => e.key === 'Enter' && onAddCustomSubject()}
              />
              <Button size="sm" onClick={onAddCustomSubject} disabled={!customSubjectName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {allSubjects.slice(0, 8).map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: subject.color }}
                />
                <span className="truncate">{subject.name}</span>
              </div>
            ))}
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
            <Label htmlFor="start-time">First Period Start Time</Label>
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
              min="15"
              max="120"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(parseInt(e.target.value) || 45)}
            />
          </div>
        </CardContent>
      </Card>
        {/* Break Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Break Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-break"
              checked={enableBreak}
              onCheckedChange={setEnableBreak}
            />
            <Label htmlFor="enable-break">Enable Break</Label>
          </div>
          
          {enableBreak && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="break-after">Break After Period</Label>
                <Select value={breakAfterPeriod.toString()} onValueChange={(value) => setBreakAfterPeriod(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Period 2</SelectItem>
                    <SelectItem value="3">Period 3</SelectItem>
                    <SelectItem value="4">Period 4</SelectItem>
                    <SelectItem value="5">Period 5</SelectItem>
                    <SelectItem value="6">Period 6</SelectItem>
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
                  onChange={(e) => setBreakDuration(parseInt(e.target.value) || 15)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Break Configuration-2 */}
      <Card>
        <CardHeader>
          <CardTitle>Break Configuration-2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-break-2"
              checked={enableBreak2}
              onCheckedChange={setEnableBreak2}
            />
            <Label htmlFor="enable-break-2">Enable Break 2</Label>
          </div>
          {enableBreak2 && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="break-after-2">Break 2 After Period</Label>
                <Select value={breakAfterPeriod2.toString()} onValueChange={(value) => setBreakAfterPeriod2(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Period 2</SelectItem>
                    <SelectItem value="3">Period 3</SelectItem>
                    <SelectItem value="4">Period 4</SelectItem>
                    <SelectItem value="5">Period 5</SelectItem>
                    <SelectItem value="6">Period 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="break-duration-2">Break 2 Duration (minutes)</Label>
                <Input
                  id="break-duration-2"
                  type="number"
                  min="5"
                  max="60"
                  value={breakDuration2}
                  onChange={(e) => setBreakDuration2(parseInt(e.target.value) || 15)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={onClearTimetable} className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Timetable
          </Button>
          
          <Button onClick={() => {}} className="w-full bg-secondary hover:bg-teal-600">
            <Save className="w-4 h-4 mr-2" />
            Save to Local Storage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
