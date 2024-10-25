// Columns definition for the subjects table
const columns = [
  { name: "ID", uid: "_id", sortable: true }, // Unique identifier for the subject
  { name: "NAME", uid: "name", sortable: true }, // Name of the subject
  { name: "CODE", uid: "code", sortable: true }, // Subject code (e.g., "MATH101")
  { name: "DESCRIPTION", uid: "description" }, // Description of the subject
  { name: "IMAGE", uid: "image" }, // URL to the subject's image
  { name: "TEACHER ID", uid: "teacher" }, // ID of the teacher associated with the subject
  { name: "CLASSES", uid: "classes" }, // Array of class IDs related to the subject
  { name: "CREDITS", uid: "credits", sortable: true }, // Number of credits for the subject
  { name: "DEPARTMENT", uid: "department" }, // Department offering the subject
  { name: "DATE CREATED", uid: "createdAt", sortable: true }, // Creation timestamp
  { name: "DATE UPDATED", uid: "updatedAt", sortable: true }, // Last update timestamp
  { name: "ACTIONS", uid: "actions" }, // Actions for managing the subject
];

// Exporting the SubjectType and subjectColumns
export { columns };
