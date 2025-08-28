
"use client"

import { useState, useRef, useEffect } from "react"
import type { jsPDF } from "jspdf";
import type html2canvas from 'html2canvas';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileImage, FileText, PlusCircle, Trash2, Coffee } from "lucide-react"

interface Subject {
  id: string
  name: string
}

interface Teacher {
  id: string
  name: string
}

interface Period {
  id: number
  subjectId: string
  teacherId: string
}

interface TimeSlot {
    id: number;
    type: 'period' | 'break';
    subjectId?: string;
    teacherId?: string;
    startTime: string;
    duration: number;
    endTime: string;
    title?: string;
}


const PREDEFINED_SUBJECTS = ["Computer", "Hindi", "English", "Mathematics", "Science", "Social Science", "Sanskrit", "Urdu","History", "Civics/Political Sc.","Geography","Economics","Physics","Chemistry","Biology"]

const CLASSES = [
  "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function Timetable() {
  const [selectedClass, setSelectedClass] = useState<string>("Class 3")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<string>("")
  
  const [subjects, setSubjects] = useState<Subject[]>(
    PREDEFINED_SUBJECTS.map((name, index) => ({ id: `subject-${index}`, name })),
  )
  const [teachers, setTeachers] = useState<Teacher[]>([
      { id: 'teacher-1', name: 'Mr. Smith' },
      { id: 'teacher-2', name: 'Mrs. Jones' }
  ])
  
  const [periods, setPeriods] = useState<Period[]>(
    Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      subjectId: "",
      teacherId: "",
    })),
  )

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [initialStartTime, setInitialStartTime] = useState("08:00");
  const [periodDuration, setPeriodDuration] = useState(45);
  
  const [break1, setBreak1] = useState<{ afterPeriodId: string; duration: number }>({ afterPeriodId: "none", duration: 15 });
  const [break2, setBreak2] = useState<{ afterPeriodId: string; duration: number }>({ afterPeriodId: "none", duration: 30 });


  const [newSubjectName, setNewSubjectName] = useState("")
  const [newTeacherName, setNewTeacherName] = useState("")
  const timetableRef = useRef<HTMLDivElement>(null)

  const html2canvasRef = useRef<typeof html2canvas | null>(null);
  const jspdfRef = useRef<typeof jsPDF | null>(null);
  const [isLibsLoaded, setIsLibsLoaded] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after hydration
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedDay(DAYS[new Date().getDay() - 1] || "Sunday");
  }, []);


  useEffect(() => {
    Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]).then(([html2canvasModule, jspdfModule]) => {
      html2canvasRef.current = html2canvasModule.default;
      jspdfRef.current = jspdfModule.jsPDF;
      setIsLibsLoaded(true);
    });
  }, []);

  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const minutesToTime = (minutes: number): string => {
    if (isNaN(minutes) || minutes < 0) return "";
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

 useEffect(() => {
    let currentTime = timeToMinutes(initialStartTime);
    const newTimeSlots: TimeSlot[] = [];

    const breaks = [
        break1.afterPeriodId !== "none" ? { afterPeriodId: parseInt(break1.afterPeriodId, 10), duration: break1.duration, title: "Break 1" } : null,
        break2.afterPeriodId !== "none" ? { afterPeriodId: parseInt(break2.afterPeriodId, 10), duration: break2.duration, title: "Break 2" } : null,
    ].filter((b): b is { afterPeriodId: number; duration: number; title: string } => b !== null);

    periods.forEach(period => {
      // Add period
      newTimeSlots.push({
        id: period.id,
        type: 'period',
        subjectId: period.subjectId,
        teacherId: period.teacherId,
        startTime: minutesToTime(currentTime),
        duration: periodDuration,
        endTime: minutesToTime(currentTime + periodDuration),
      });
      currentTime += periodDuration;

      // Check for and add break
      const breakInfo = breaks.find(b => b.afterPeriodId === period.id);
      if (breakInfo) {
        newTimeSlots.push({
          id: Date.now() + period.id, // Unique ID for break
          type: 'break',
          title: breakInfo.title,
          startTime: minutesToTime(currentTime),
          duration: breakInfo.duration,
          endTime: minutesToTime(currentTime + breakInfo.duration),
        });
        currentTime += breakInfo.duration;
      }
    });

    setTimeSlots(newTimeSlots);
  }, [periods, initialStartTime, periodDuration, break1, break2]);

  const updatePeriod = (periodId: number, field: 'subjectId' | 'teacherId', value: string) => {
    setPeriods(prev => prev.map(p => p.id === periodId ? { ...p, [field]: value } : p));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSubject: Subject = { id: `subject-${Date.now()}`, name: newSubjectName.trim() };
    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
  };

  const addTeacher = () => {
    if (!newTeacherName.trim()) return;
    const newTeacher: Teacher = { id: `teacher-${Date.now()}`, name: newTeacherName.trim() };
    setTeachers([...teachers, newTeacher]);
    setNewTeacherName("");
  };

  const addPeriod = () => {
    setPeriods(prev => [...prev, {
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
        subjectId: "",
        teacherId: "",
    }]);
  };

  const removePeriod = (id: number) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
    if (String(id) === break1.afterPeriodId) setBreak1({ ...break1, afterPeriodId: "none"});
    if (String(id) === break2.afterPeriodId) setBreak2({ ...break2, afterPeriodId: "none"});
  };

  const downloadFile = async (format: 'png' | 'pdf') => {
    if (!timetableRef.current || !html2canvasRef.current || !jspdfRef.current) return;
    const html2canvas = html2canvasRef.current;
    const canvas = await html2canvas(timetableRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    const filename = `${selectedClass}-timetable-${selectedDate}`;

    if (format === 'png') {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } else {
      try {
        const jsPDF = (await import("jspdf")).default;
        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${selectedClass}-timetable-${selectedDate}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSES.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div>
                <Label>Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS.map((day) => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent>
                </Select>
              </div>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <Label>School Start Time</Label>
                <Select value={initialStartTime} onValueChange={setInitialStartTime}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="07:30">7:30 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="08:30">8:30 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Period Duration (minutes)</Label>
                <Input type="number" value={periodDuration} onChange={(e) => setPeriodDuration(Number(e.target.value))} min="1" />
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Add New Subject</Label>
                <div className="flex gap-2">
                  <Input value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="e.g. Art"/>
                  <Button onClick={addSubject}>Add</Button>
                </div>
              </div>
              <div>
                <Label>Add New Teacher</Label>
                <div className="flex gap-2">
                  <Input value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} placeholder="e.g. Ms. Frizzle"/>
                  <Button onClick={addTeacher}>Add</Button>
                </div>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
              {/* Break 1 Controls */}
              <div className="space-y-2">
                  <Label className="font-semibold">Break 1 (e.g., Recess)</Label>
                  <div className="grid grid-cols-2 gap-2">
                      <div>
                          <Label className="text-xs">After Period</Label>
                          <Select onValueChange={(val) => setBreak1({...break1, afterPeriodId: val})} value={break1.afterPeriodId}>
                              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {periods.map(p => <SelectItem key={`b1-${p.id}`} value={String(p.id)}>{p.id}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div>
                          <Label className="text-xs">Duration (min)</Label>
                          <Input type="number" value={break1.duration} onChange={e => setBreak1({...break1, duration: Number(e.target.value)})} min="1" />
                      </div>
                  </div>
              </div>
              {/* Break 2 Controls */}
              <div className="space-y-2">
                   <Label className="font-semibold">Break 2 (e.g., Lunch)</Label>
                  <div className="grid grid-cols-2 gap-2">
                       <div>
                          <Label className="text-xs">After Period</Label>
                          <Select onValueChange={(val) => setBreak2({...break2, afterPeriodId: val})} value={break2.afterPeriodId}>
                              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {periods.map(p => <SelectItem key={`b2-${p.id}`} value={String(p.id)}>{p.id}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div>
                          <Label className="text-xs">Duration (min)</Label>
                          <Input type="number" value={break2.duration} onChange={e => setBreak2({...break2, duration: Number(e.target.value)})} min="1" />
                      </div>
                  </div>
              </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div ref={timetableRef} className="bg-white p-6">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-primary">Timetable</h2>
                <p className="text-muted-foreground">{selectedClass} - {selectedDay}, {selectedDate}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="border p-3 text-center font-semibold text-lg w-20">Period</th>
                    <th className="border p-3 text-left font-semibold text-lg">Subject</th>
                    <th className="border p-3 text-left font-semibold text-lg">Teacher</th>
                    <th className="border p-3 text-center font-semibold text-lg">Start Time</th>
                    <th className="border p-3 text-center font-semibold text-lg">Duration</th>
                    <th className="border p-3 text-center font-semibold text-lg">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => {
                    if (slot.type === 'break') {
                      return (
                        <tr key={slot.id} className="bg-accent/20 hover:bg-accent/30">
                          <td colSpan={3} className="border p-2 font-bold text-lg text-center align-middle">
                            <div className="flex items-center justify-center gap-2">
                                <Coffee className="h-5 w-5" />
                                <span>{slot.title}</span>
                            </div>
                          </td>
                          <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.startTime}</td>
                          <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.duration}m</td>
                          <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.endTime}</td>
                        </tr>
                      )
                    }

                    const period = periods.find(p => p.id === slot.id);
                    if (!period) return null;

                    return (
                      <tr key={slot.id} className="hover:bg-muted/50">
                        <td className="border p-2 font-bold text-lg text-center align-middle">{period.id}</td>
                        <td className="border p-2 min-w-[200px]" >
                          <Select  value={period.subjectId} onValueChange={(value) => updatePeriod(period.id, "subjectId", value)} >
                            <SelectTrigger id="start-time" className="text-xl font-semibold h-14"><SelectValue id="time-dropdown" placeholder="Select Subject" /></SelectTrigger>
                            <SelectContent >{subjects.map((s) => (<SelectItem key={s.id} value={s.id} className="text-xl">{s.name}</SelectItem>))}</SelectContent>
                          </Select>
                        </td>
                        <td className="border p-2 min-w-[200px]">
                          <Select value={period.teacherId} onValueChange={(value) => updatePeriod(period.id, "teacherId", value)}>
                            <SelectTrigger id="start-time" className="text-xl font-semibold h-14"><SelectValue id="time-dropdown" placeholder="Select Teacher" /></SelectTrigger>
                            <SelectContent>{teachers.map((t) => (<SelectItem key={t.id} value={t.id} className="text-xl">{t.name}</SelectItem>))}</SelectContent>
                          </Select>
                        </td>
                        <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.startTime}</td>
                        <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.duration}m</td>
                        <td className="border p-2 text-center align-middle font-mono text-xl font-semibold">{slot.endTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                  <Button onClick={addPeriod} variant="outline" className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Period
                  </Button>
                  <Button onClick={() => removePeriod(periods[periods.length - 1]?.id)} variant="destructive" className="w-full md:w-auto" disabled={periods.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4"/> Remove Last Period
                  </Button>
              </div>
            </div>
            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p>Generated by PurniaPulse</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => downloadFile('png')} variant="outline" className="w-full sm:w-auto" disabled={!isLibsLoaded}>
          <FileImage className="w-4 h-4 mr-2" />
          Download as Image
        </Button>
        <Button onClick={() => downloadFile('pdf')} className="w-full sm:w-auto" disabled={!isLibsLoaded}>
          <FileText className="w-4 h-4 mr-2" />
          Download as PDF
        </Button>
      </div>
    </div>
  )
}

    
