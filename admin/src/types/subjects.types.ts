export type singleSubjectResponse = {
  _id: string;
  code: string;
  createdAt: string;
  credits: number;
  department: string;
  description: string;
  image: string;
  name: string;
  teacher: {
    name: string;
    _id: string;
  };
  updatedAt: string;
  __v: number;
  classes: [
    {
      _id: string;
      name: string;
    }
  ];
};

export type SubjectType = {
  _id?: string; // Unique identifier for the subject
  name: string; // Name of the subject (e.g., "Mathematics")
  code: string; // Subject code (e.g., "MATH101")
  description: string; // Description of the subject
  image: string; // URL to the subject's image
  teacher: string; // ID of the teacher associated with the subject
  classes: string[]; // Array of class IDs related to the subject
  credits: number; // Number of credits for the subject
  department: string; // Department offering the subject (e.g., "Science", "Humanities")
};

export interface SubjectResponse {
  subjects: SubjectType[];
  page: number;
  limit: number;
  totalPages: number;
  totalSubjects: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
