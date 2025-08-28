import { Button } from "@/components/ui-weekly/button";
import { Download, FileImage } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportImage: () => void;
}

export default function ExportButtons({ onExportPDF, onExportImage }: ExportButtonsProps) {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" size="sm" onClick={onExportImage} title="Export as Image">
        <FileImage className="mr-2 h-4 w-4" /> Export Image
      </Button>
      <Button variant="outline" size="sm" onClick={onExportPDF} title="Export as PDF">
        <Download className="mr-2 h-4 w-4" /> Export PDF
      </Button>
    </div>
  );
}