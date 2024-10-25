export interface ExamFormValues {
  name: string;
  startDate: string;
  endDate: string;
  class: string;
  subjects: {
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    maxMarks: string;
    examDate: string;
  }[];
  status: "scheduled" | "completed" | "cancelled";
}

export interface ExamType {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  class: string;
  subjects: {
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    maxMarks: string;
    examDate: string;
  }[];
  status: "scheduled" | "completed" | "cancelled";
}

type Subject = {
  _id: string;
  name: string;
};

type Teacher = {
  _id: string;
  name: string;
};

type SubjectInfo = {
  subject: Subject;
  teacher: Teacher;
  startTime: string; // in HH:MM format
  endTime: string; // in HH:MM format
  maxMarks: number;
  examDate: string; // ISO date string
  _id: string;
};

type ClassInfo = {
  _id: string;
  name: string;
};

export type Exam = {
  _id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  class: ClassInfo;
  subjects: SubjectInfo[];
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type ExamsResponse = {
  exams: Exam[];
  page: number;
  limit: number;
  totalPages: number;
  totalExams: number;
  currentPage: number;
  nextPage: string | null;
  prevPage: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ExamInfo = {
  message: string;
  exam: Exam;
};

export interface DetailExamResponse {
  _id: string;
  name: string;
  startDate: string; // Date in ISO format
  endDate: string; // Date in ISO format
  class: {
    _id: string;
    name: string;
  };
  subjects: Array<{
    subject: {
      _id: string;
      name: string;
    };
    teacher: {
      _id: string;
      name: string;
    };
    startTime: string; // Time in HH:mm format
    endTime: string; // Time in HH:mm format
    maxMarks: number;
    examDate: string; // Date in ISO format
    _id: string;
  }>;
  status: "completed" | "pending" | "scheduled"; // Depending on possible statuses
  createdAt: string; // Date in ISO format
  updatedAt: string; // Date in ISO format
  __v: number;
}
