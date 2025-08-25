"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Calendar } from "lucide-react";
import TimetableGrid from "@/components/weekly/TimetableGrid";
import ControlPanel from "@/components/weekly/ControlPanel";
import SubjectModal from "@/components/weekly/SubjectModal";
import ExportButtons from "@/components/weekly/ExportButtons";
// Dynamically import heavy libraries only when needed
import { presetSubjects } from "@/lib/plangen/subjects";
import { calculatePeriodTimes } from "@/lib/plangen/timeUtils";
import type { WeekSchedule, CustomSubject } from "@/lib/plangen/types";

export default function TimetablePage() {
  // const { user, loading } = useAuth();
  const [selectedClass, setSelectedClass] = useState("Class 1");
  const [startTime, setStartTime] = useState("09:00");
  const [periodDuration, setPeriodDuration] = useState(45);
  const [enableBreak, setEnableBreak] = useState(true);
  const [breakAfterPeriod, setBreakAfterPeriod] = useState(4);
  const [breakDuration, setBreakDuration] = useState(15);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>([]);
  const [customSubjectName, setCustomSubjectName] = useState("");
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
  });
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [currentCell, setCurrentCell] = useState<{ day: string; period: number } | null>(null);
  const periodTimes = calculatePeriodTimes(startTime, periodDuration, enableBreak, breakAfterPeriod, breakDuration);

  // Permission check removed: all users can access

  const handleExportImage = async () => {
    const timetable = document.getElementById("timetable-container");
    if (!timetable) return;

    const originalStyle = {
      overflow: timetable.style.overflow,
      width: timetable.style.width,
      transform: timetable.style.transform,
      transformOrigin: timetable.style.transformOrigin,
    };

    timetable.style.overflow = "visible";
    timetable.style.width = timetable.scrollWidth + "px";
    timetable.style.transform = "scale(2)";
    timetable.style.transformOrigin = "top left";

    await new Promise(r => setTimeout(r, 200));

    // Dynamically import html2canvas only when exporting
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(timetable, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: timetable.scrollWidth * 2,
      windowHeight: timetable.scrollHeight * 2,
    });

    Object.assign(timetable.style, originalStyle);

    const link = document.createElement("a");
    link.download = "timetable.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const handleExportPDF = async () => {
    const timetable = document.getElementById("timetable-container");
    if (!timetable) return;

    const originalStyle = {
      overflow: timetable.style.overflow,
      width: timetable.style.width,
      transform: timetable.style.transform,
      transformOrigin: timetable.style.transformOrigin,
    };

    timetable.style.overflow = "visible";
    timetable.style.width = timetable.scrollWidth + "px";
    timetable.style.transform = "scale(2)";
    timetable.style.transformOrigin = "top left";

    await new Promise(r => setTimeout(r, 200));

    // Dynamically import html2canvas and jsPDF only when exporting
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(timetable, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: timetable.scrollWidth * 2,
      windowHeight: timetable.scrollHeight * 2,
    });

    Object.assign(timetable.style, originalStyle);

    const imgData = canvas.toDataURL("image/png");
    const jsPDF = (await import("jspdf")).default;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("timetable.pdf");
  };

  const handleCellClick = (day: string, period: number) => {
    setCurrentCell({ day, period });
    setShowSubjectModal(true);
  };

  const handleAddCustomSubject = (subject: CustomSubject) => {
    setCustomSubjects((prev) => [...prev, subject]);
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
  };

  const handleSubjectSelect = (subject: string, color: string) => {
    if (!currentCell) return;
    setSchedule((prev) => {
      const updated = { ...prev };
      updated[currentCell.day] = {
        ...updated[currentCell.day],
        [currentCell.period]: { subject, color },
      };
      return updated;
    });
    setShowSubjectModal(false);
    setCurrentCell(null);
  };

  const handleClearCell = () => {
    if (!currentCell) return;
    setSchedule((prev) => {
      const updated = { ...prev };
      const { [currentCell.period]: _, ...rest } = updated[currentCell.day];
      updated[currentCell.day] = rest;
      return updated;
    });
    setShowSubjectModal(false);
    setCurrentCell(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-primary-foreground">Timetable Creator</h1>
                <p className="text-sm text-gray-500">Weekly Schedule Planner</p>
              </div>
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
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            customSubjectName={customSubjectName}
            setCustomSubjectName={setCustomSubjectName}
            customSubjects={customSubjects}
            onAddCustomSubject={handleAddCustomSubject}
            onClearTimetable={handleClearTimetable}
          />
          <div className="flex-1 flex flex-col gap-4">
            <ExportButtons onExportPDF={handleExportPDF} onExportImage={handleExportImage} />
            <TimetableGrid
              schedule={schedule}
              periodTimes={periodTimes}
              enableBreak={enableBreak}
              breakAfterPeriod={breakAfterPeriod}
              selectedClass={selectedClass}
              onCellClick={handleCellClick}
              onClassChange={setSelectedClass}
            />
          </div>
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
