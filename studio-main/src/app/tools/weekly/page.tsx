"use client";

import { useState, useEffect } from "react";
import { Calendar, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui-weekly/button";
import { useToast } from "@/hooks/use-toast";
import TimetableGrid from "@/components/TimetableGrid";
import ControlPanel from "@/components/ControlPanel";
import SubjectModal from "@/components/SubjectModal";
import { presetSubjects } from "@/lib/weekly/subjects";
import { calculatePeriodTimes } from "@/lib/weekly/timeUtils";
import { exportToPDF, exportToImage } from "@/components/exportUtils";
import type { WeekSchedule, CustomSubject, SubjectAssignment } from "@/components/schema";

export default function TimetablePage() {
  const { toast } = useToast();
  
  // Timetable configuration state
  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [startTime, setStartTime] = useState("09:00");
  const [periodDuration, setPeriodDuration] = useState(45);
  const [enableBreak, setEnableBreak] = useState(true);
  const [breakAfterPeriod, setBreakAfterPeriod] = useState(4);
  const [breakDuration, setBreakDuration] = useState(15);
  // Second break state
  const [enableBreak2, setEnableBreak2] = useState(false);
  const [breakAfterPeriod2, setBreakAfterPeriod2] = useState(6);
  const [breakDuration2, setBreakDuration2] = useState(10);
  
  // Subject management state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>([]);
  const [customSubjectName, setCustomSubjectName] = useState("");
  
  // Grid state
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
  });
  
  // Modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [currentCell, setCurrentCell] = useState<{ day: string; period: number } | null>(null);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Period times calculation
  const periodTimes = calculatePeriodTimes(
    startTime,
    periodDuration,
    enableBreak,
    breakAfterPeriod,
    breakDuration,
    enableBreak2,
    breakAfterPeriod2,
    breakDuration2
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("timetable-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSchedule(data.schedule || {});
        setCustomSubjects(data.customSubjects || []);
        setSelectedClass(data.selectedClass || "Class 1");
        setStartTime(data.startTime || "09:00");
        setPeriodDuration(data.periodDuration || 45);
        setEnableBreak(data.enableBreak !== false);
        setBreakAfterPeriod(data.breakAfterPeriod || 4);
        setBreakDuration(data.breakDuration || 15);
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const data = {
      schedule,
      customSubjects,
      selectedClass,
      startTime,
      periodDuration,
  enableBreak,
  breakAfterPeriod,
  breakDuration,
  enableBreak2,
  breakAfterPeriod2,
  breakDuration2,
    };
    localStorage.setItem("timetable-data", JSON.stringify(data));
  }, [schedule, customSubjects, selectedClass, startTime, periodDuration, enableBreak, breakAfterPeriod, breakDuration]);

  const handleCellClick = (day: string, period: number) => {
    setCurrentCell({ day, period });
    setShowSubjectModal(true);
  };

  const handleSubjectSelect = (subject: string, color: string) => {
    if (!currentCell) return;
    
    const { day, period } = currentCell;
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeekSchedule],
        [period]: { subject, color }
      }
    }));
    
    setShowSubjectModal(false);
    setCurrentCell(null);
  };

  const handleClearCell = () => {
    if (!currentCell) return;
    
    const { day, period } = currentCell;
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const daySchedule = { ...newSchedule[day as keyof WeekSchedule] };
      delete daySchedule[period];
      newSchedule[day as keyof WeekSchedule] = daySchedule;
      return newSchedule;
    });
    
    setShowSubjectModal(false);
    setCurrentCell(null);
  };

  const handleAddCustomSubject = () => {
    if (!customSubjectName.trim()) return;
    
    const colors = ["#4CAF50", "#2196F3", "#FF5722", "#9C27B0", "#795548", "#E91E63"];
    const color = colors[customSubjects.length % colors.length];
    
    const newSubject: CustomSubject = {
      id: Date.now().toString(),
      name: customSubjectName.trim(),
      color
    };
    
    setCustomSubjects(prev => [...prev, newSubject]);
    setCustomSubjectName("");
    
    toast({
      title: "Subject Added",
      description: `${newSubject.name} has been added to your subjects.`,
    });
  };

  const handleClearTimetable = () => {
    setSchedule({
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
    });
    
    toast({
      title: "Timetable Cleared",
      description: "All subjects have been removed from the timetable.",
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(schedule, periodTimes, enableBreak, breakAfterPeriod, selectedClass);
      toast({
        title: "PDF Exported",
        description: "Your timetable has been exported as PDF.",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportToImage(schedule, periodTimes, enableBreak, breakAfterPeriod, selectedClass);
      toast({
        title: "Image Exported",
        description: "Your timetable has been exported as image.",
      });
    } catch (error) {
      console.error("Image export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Timetable Creator</h1>
                <p className="text-sm text-gray-500">Weekly Schedule Planner</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-red-600 hover:bg-red-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportImage}
                disabled={isExporting}
              >
                <Image className="w-4 h-4 mr-2" />
                Export Image
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <ControlPanel
            startTime={startTime}
            setStartTime={setStartTime}
            periodDuration={periodDuration}
            setPeriodDuration={setPeriodDuration}
            enableBreak={enableBreak}
            setEnableBreak={setEnableBreak}
            breakAfterPeriod={breakAfterPeriod}
            setBreakAfterPeriod={setBreakAfterPeriod}
            breakDuration={breakDuration}
            setBreakDuration={setBreakDuration}
            enableBreak2={enableBreak2}
            setEnableBreak2={setEnableBreak2}
            breakAfterPeriod2={breakAfterPeriod2}
            setBreakAfterPeriod2={setBreakAfterPeriod2}
            breakDuration2={breakDuration2}
            setBreakDuration2={setBreakDuration2}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            customSubjectName={customSubjectName}
            setCustomSubjectName={setCustomSubjectName}
            customSubjects={customSubjects}
            onAddCustomSubject={handleAddCustomSubject}
            onClearTimetable={handleClearTimetable}
          />
          
          <TimetableGrid
            schedule={schedule}
            periodTimes={periodTimes}
            enableBreak={enableBreak}
            breakAfterPeriod={breakAfterPeriod}
            enableBreak2={enableBreak2}
            breakAfterPeriod2={breakAfterPeriod2}
            selectedClass={selectedClass}
            onCellClick={handleCellClick}
            onClassChange={setSelectedClass}
          />
        </div>
      </div>

      <SubjectModal
        open={showSubjectModal}
        onOpenChange={setShowSubjectModal}
        allSubjects={[...presetSubjects, ...customSubjects]}
        onSubjectSelect={handleSubjectSelect}
        onClearCell={handleClearCell}
      />
    </div>
  );
}
