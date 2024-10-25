export type Attendee = {
  attendeeId: string; // The ObjectId of the attendee (Student or Teacher)
  role: "Teacher" | "Student"; // Role of the attendee
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO date string (start date)
  location: string;
  organizer: string;
  attendees: Attendee[]; // Array of attendees with attendeeId and role
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: string; // ISO date string for the creation timestamp
  updatedAt: string; // ISO date string for the last update timestamp
  __v: number;
};

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  attendees: { attendeeId: string; role: "Teacher" | "Student" }[];
  organizer: string;
};

export type AllEventsResponse = {
  events: Event[];
  page: number;
  limit: number;
  totalPages: number;
  totalEvents: number;
  currentPage: number;
  nextPage: string | null;
  prevPage: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type EventResponse = {
  message: string;
  event: Event;
};
