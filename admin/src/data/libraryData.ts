const libraryColumns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "Name", uid: "name", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Category", uid: "category", sortable: false },
  { name: "Availability Status", uid: "availability_status", sortable: true },
  { name: "Quantity", uid: "quantity", sortable: true },
  { name: "Borrow Limit", uid: "borrow_limit", sortable: true },
  { name: "Late Fee (Per Day)", uid: "late_fee_per_day", sortable: true },
  { name: "Location", uid: "location", sortable: false },
  { name: "Created At", uid: "createdAt", sortable: true },
  { name: "Updated At", uid: "updatedAt", sortable: true },
  { name: "Actions", uid: "actions" },
];

const availabilityStatusOptions = [
  { name: "Available", uid: "available" },
  { name: "Borrowed", uid: "borrowed" },
  { name: "Reserved", uid: "reserved" },
];

export { libraryColumns, availabilityStatusOptions };
