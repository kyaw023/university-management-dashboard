const columns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "Exam Name", uid: "examName", sortable: true },
  { name: "Start Date", uid: "startDate", sortable: true },
  { name: "End Date", uid: "endDate", sortable: true },
  { name: "Class", uid: "class", sortable: true },
  { name: "Subjects", uid: "subjects" },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Scheduled", uid: "scheduled" },
  { name: "Completed", uid: "completed" },
  { name: "Cancelled", uid: "cancelled" },
];

export { columns, statusOptions };
