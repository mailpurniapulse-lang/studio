import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-weekly/dialog";
import { Button } from "@/components/ui-weekly/button";
import type { CustomSubject } from "@/lib/weekly/types";

interface SubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allSubjects: CustomSubject[];
  onSubjectSelect: (subject: string, color: string) => void;
  onClearCell: () => void;
}

export default function SubjectModal({
  open,
  onOpenChange,
  allSubjects,
  onSubjectSelect,
  onClearCell,
}: SubjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg">Select Subject</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4 overflow-y-auto" style={{maxHeight: '50vh'}}>
          {allSubjects.map((subject) => (
            <Button
              key={subject.id}
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-center justify-center space-y-2 bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold shadow"
              style={{ borderColor: subject.color }}
              onClick={() => onSubjectSelect(subject.name, subject.color)}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white mb-1"
                style={{ backgroundColor: subject.color }}
              />
              <span className="text-sm font-bold" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>{subject.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold"
            onClick={onClearCell}
          >
            Clear Cell
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
