import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { WeekSchedule } from "@/components/weekly/schema";
// If the alias does not work, use a relative path like:
// import type { WeekSchedule } from "../../../shared/schema";

export async function exportToPDF(
  schedule: WeekSchedule,
  periodTimes: Array<{ title: string; time: string }>,
  enableBreak: boolean,
  breakAfterPeriod: number,
  selectedClass?: string
) {
  const element = document.getElementById('timetable-container');
  if (!element) throw new Error('Timetable container not found');

  // Create a clone for PDF export with print styles
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0px';
  clone.style.background = 'white';
  clone.style.width = '297mm'; // A4 landscape width
  clone.style.height = 'auto';
  clone.style.fontSize = '10px';
  clone.style.padding = '10mm';
  clone.style.boxSizing = 'border-box';
  
  // Show title in export
  const printTitle = clone.querySelector('.print-title') as HTMLElement;
  if (printTitle) {
    printTitle.style.display = 'block';
    printTitle.style.marginBottom = '15px';
    printTitle.style.textAlign = 'center';
  }

  // Style the table for landscape export
  const table = clone.querySelector('table') as HTMLElement;
  if (table) {
    table.style.width = '100%';
    table.style.fontSize = '9px';
    table.style.borderCollapse = 'collapse';
    
    // Style all cells
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.padding = '6px 4px';
      htmlCell.style.border = '1px solid #000';
      htmlCell.style.fontSize = '9px';
      htmlCell.style.lineHeight = '1.2';
    });

    // Style subject cells for better visibility
    const subjectCells = table.querySelectorAll('[style*="background-color"]');
    subjectCells.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.fontSize = '10px';
      htmlCell.style.fontWeight = '600';
      htmlCell.style.color = '#374151';
    });
  }
  
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1123, // A4 landscape width in pixels
      height: 794,  // A4 landscape height in pixels
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
    
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = 210; // A4 landscape height in mm

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, selectedClass);
    pdf.save('timetable.pdf');
  } finally {
    document.body.removeChild(clone);
  }
}

export async function exportToImage(
  schedule: WeekSchedule,
  periodTimes: Array<{ title: string; time: string }>,
  enableBreak: boolean,
  breakAfterPeriod: number,
  selectedClass?: string
) {
  const element = document.getElementById('timetable-container');
  if (!element) throw new Error('Timetable container not found');

  // Create a clone for image export with landscape styling
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0px';
  clone.style.background = 'white';
  clone.style.width = '1123px'; // A4 landscape width in pixels
  clone.style.height = 'auto';
  clone.style.padding = '20px';
  clone.style.boxSizing = 'border-box';
  
  // Show title in export
  const printTitle = clone.querySelector('.print-title') as HTMLElement;
  if (printTitle) {
    printTitle.style.display = 'block';
    printTitle.style.marginBottom = '15px';
    printTitle.style.textAlign = 'center';
  }

  // Style the table for landscape export
  const table = clone.querySelector('table') as HTMLElement;
  if (table) {
    table.style.width = '100%';
    table.style.fontSize = '12px';
    table.style.borderCollapse = 'collapse';
    table.style.minWidth = '1080px';
    
    // Style all cells
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.padding = '8px 6px';
      htmlCell.style.border = '1px solid #000';
      htmlCell.style.fontSize = '12px';
      htmlCell.style.lineHeight = '1.3';
      htmlCell.style.whiteSpace = 'nowrap';
    });

    // Style subject cells for better visibility
    const subjectCells = table.querySelectorAll('[style*="background-color"]');
    subjectCells.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.fontSize = '13px';
      htmlCell.style.fontWeight = '600';
      htmlCell.style.color = '#374151';
    });

    // Make sure day column is visible
    const dayHeaders = table.querySelectorAll('th:first-child, td:first-child');
    dayHeaders.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.backgroundColor = '#f8f9fa';
      htmlCell.style.fontWeight = '600';
      htmlCell.style.minWidth = '80px';
    });
  }
  
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1123, // A4 landscape width in pixels
      height: 794,  // A4 landscape height in pixels
      scrollX: 0,
      scrollY: 0,
    });

    const link = document.createElement('a');
    link.download = 'timetable.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(clone);
  }
}