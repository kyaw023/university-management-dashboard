const eventColumns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "Event Title", uid: "title", sortable: true },
  { name: "Description", uid: "description", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Location", uid: "location", sortable: true },
  { name: "Organizer", uid: "organizer", sortable: true },
  { name: "Attendees", uid: "attendees" },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

const eventStatusOptions = [
  { name: "Scheduled", uid: "scheduled" },
  { name: "Completed", uid: "completed" },
  { name: "Cancelled", uid: "cancelled" },
];

export { eventColumns, eventStatusOptions };
