export interface Library {
  _id: string;
  name: string;
  type: "book" | "equipment" | "room";
  category?: string;
  availability_status: "available" | "borrowed" | "reserved";
  quantity: number;
  description?: string;
  borrow_limit: number;
  late_fee_per_day: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LibraryResponse {
  libraries: Library[];
  page: number;
  limit: number;
  totalPages: number;
  totalLibrary: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
