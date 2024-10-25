const columns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "GENDER", uid: "gender", sortable: true },
  { name: "DATE OF BIRTH", uid: "date_of_birth", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "IMAGE", uid: "image" },
  { name: "EMPLOYMENT STATUS", uid: "employment_status", sortable: true },
  { name: "HIRE DATE", uid: "hire_date", sortable: true },
  { name: "SALARY", uid: "salary", sortable: true },
  { name: "QUALIFICATIONS", uid: "qualifications" },
  { name: "SUBJECTS", uid: "subjects" },
  { name: "CLASSES", uid: "classes" },
  { name: "SCHEDULE", uid: "schedule" },
  { name: "DATE CREATED", uid: "createdAt", sortable: true },
  { name: "DATE UPDATED", uid: "updatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
];

export { columns, statusOptions };
