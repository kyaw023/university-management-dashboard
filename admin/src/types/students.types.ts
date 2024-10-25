export interface Student {
  _id?: string;
  name: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: "male" | "female";
  address: string;
  roll_no: number;
  phone: string;
  image?: string | File;
  status: "active" | "inactive";
  class: string;
  father_name?: string;
  mother_name?: string;
  enrollment_date: string;
  grade: string;
  attendance: number;
  medical_conditions: string;
  notes?: string;
  emergency_contact: {
    name: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type StudentRegisterResponse = {
  message: string;
  student: Student;
};

export type singleStudentResponse = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  date_of_birth: string; // ISO date string format
  gender: "male" | "female"; // Limited to male or female
  address: string;
  roll_no: number;
  phone: string;
  image?: string | File; // URL to the image
  status: "active" | "inactive"; // Status of the student
  class: {
    _id: string;
    name: string;
  };
  father_name?: string;
  mother_name?: string;
  enrollment_date: string; // ISO date string format
  grade: string; // E.g., "10th Grade", "9th Grade", etc.
  attendance: number; // Percentage attendance
  medical_conditions: string; // Can be 'None' or any other condition
  notes?: string; // General notes about the student
  emergency_contact: {
    name: string;
    phone: string;
  }; // Nested emergency contact
  createdAt?: string; // ISO date string format
  updatedAt?: string; // ISO date string format
  __v?: number; // Version field from MongoDB
};

export interface AllStudentsResponse {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  prevPage: number | null;
  students: Student[];
  totalPages: number;
  totalStudents: number;
}
