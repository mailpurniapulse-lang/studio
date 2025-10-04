export interface CustomSubject {
  id: string;
  name: string;
  color: string;
}

export interface SubjectAssignment {
  subject: string;
  color: string;
}

export interface WeekSchedule {
  [key: string]: {
    [key: number]: SubjectAssignment;
  };
}