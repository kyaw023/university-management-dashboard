export type TeacherSchedule = {
  day: string; // e.g., "Tuesday"
  start_time: string; // e.g., "10:00 AM"
  end_time: string;
  class: string; // Class ID
  subject: string; // Subject ID
};

export interface TeacherType {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  date_of_birth: string; // Accept either a Date object or a string (if formatted)
  gender: "male" | "female" | "other";
  address: string;
  image?: string | File; // Optional field
  qualifications: string[]; // Array of qualification strings
  subjects: string[]; // Array of Subject IDs (as strings)
  classes: string[]; // Array of Class IDs (as strings)
  employment_status: "active" | "on_leave" | "retired"; // Employment status of the teacher
  hire_date: string; // Use Date or string (consistent with date_of_birth)
  salary: number; // Teacher's salary
  schedule: TeacherSchedule[]; // Array of schedule objects
}

export type TeacherRegisterResponse = {
  message: string;
  teacher: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    date_of_birth: string; // Accept either a Date object or a string (if formatted)
    gender: "male" | "female" | "other";
    address: string;
    image?: string | File; // Optional field
    qualifications: string[]; // Array of qualification strings
    subjects: string[]; // Array of Subject IDs (as strings)
    classes: string[]; // Array of Class IDs (as strings)
    employment_status: "active" | "on_leave" | "retired"; // Employment status of the teacher
    hire_date: string; // Use Date or string (consistent with date_of_birth)
    salary: number; // Teacher's salary
    schedule: {
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
      // Reference to Class model for each schedule entry
    }[];
  }[]; // Array of schedule objects ;
};

export interface TeacherResponse {
  teachers: TeacherType[];
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
