const columns = [
  { name: "ID", uid: "_id", sortable: true }, // Unique identifier for the course
  { name: "NAME", uid: "name", sortable: true }, // Name of the course
  { name: "TEACHER IDS", uid: "teacher" }, // Array of teacher IDs associated with the course
  { name: "STUDENT IDS", uid: "students" }, // Array of student IDs enrolled in the course
  { name: "SUBJECT IDS", uid: "subjects" }, // Array of subject IDs related to the course
  { name: "START DATE", uid: "start_date", sortable: true }, // Start date of the course
  { name: "END DATE", uid: "end_date", sortable: true }, // End date of the course
  { name: "CLASSROOM", uid: "classroom", sortable: true }, // Classroom location
  { name: "MAX STUDENTS", uid: "max_students", sortable: true }, // Maximum number of students
  { name: "STATUS", uid: "status", sortable: true }, // Status of the course
  { name: "SCHEDULE", uid: "schedule" }, // Schedule objects for the course
  { name: "DATE CREATED", uid: "createdAt", sortable: true }, // Date the course was created
  { name: "DATE UPDATED", uid: "updatedAt", sortable: true }, // Date the course was last updated
  { name: "ACTIONS", uid: "actions" }, // Actions for managing the course
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Completed", uid: "completed" },
];

export { columns, statusOptions };
