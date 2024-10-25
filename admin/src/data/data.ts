const columns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "GENDER", uid: "gender", sortable: true },
  { name: "DATE OF BIRTH", uid: "date_of_birth", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "IMAGE", uid: "image" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "GRADE", uid: "grade", sortable: true },
  { name: "ATTENDANCE", uid: "attendance", sortable: true },
  { name: "MEDICAL CONDITIONS", uid: "medical_conditions" },
  { name: "EMERGENCY CONTACT", uid: "emergency_contact" },
  { name: "DATE ENROLLED", uid: "enrollment_date", sortable: true },
  { name: "DATE CREATED", uid: "createdAt", sortable: true },
  { name: "DATE UPDATED", uid: "updatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
];

export { columns, statusOptions };
