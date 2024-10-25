export interface ClassSchedule {
  day: string; // The day of the week (e.g., "Monday")
  time: string; // The time of the class (e.g., "10:00 AM")
  class: string; // The ID of the class
}

export type CourseSchedule = {
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
};

export interface ResponseeSchedule {
  day: string;
  start_time: string;
  end_time: string;
  class: {
    _id: string;
    name: string;
  };
  subject: {
    _id: string;
    name: string;
  };
}

export interface Course {
  _id: string; // Unique identifier for the course
  name: string; // Name of the course (e.g., "Grade 10 - Science")
  teacher: string[]; // Array of teacher IDs associated with the course
  subjects: string[]; // Array of subject IDs related to the course
  start_date: string; // Start date of the course in ISO format
  end_date: string; // End date of the course in ISO format
  classroom: string; // Classroom location (e.g., "Room 202")
  max_students: number; // Maximum number of students allowed in the course
  status: "active" | "completed" | "cancelled"; // Status of the course
  createdAt?: string; // Date the course was created in ISO format
  updatedAt?: string; // Date the course was last updated in ISO format
  __v?: number; // Version key for the course
  weeklySchedule: CourseSchedule[]; // Array of weekly schedules for the course
}

export interface ClassResponse {
  message: string;
  class: Course[];
}

export interface ClassAllResponse {
  classes: Course[];
  page: number;
  limit: number;
  totalPages: number;
  totalTeachers: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
