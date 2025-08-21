
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Subject</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-2 py-4">
					{allSubjects.map((subject) => (
						<Button
							key={subject.id}
							variant="outline"
							className="h-auto py-4 px-4 flex flex-col items-center justify-center space-y-2"
							onClick={() => onSubjectSelect(subject.name, subject.color)}
						>
							<div 
								className="w-4 h-4 rounded" 
								style={{ backgroundColor: subject.color }}
							/>
							<span className="text-sm">{subject.name}</span>
						</Button>
					))}
				</div>
				<div className="flex justify-end">
					<Button
						variant="outline"
						onClick={onClearCell}
					>
						Clear Cell
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
