export interface IActivityLog {
  _id: string; // Unique identifier for the log entry
  action:
    | "login"
    | "logout"
    | "create"
    | "read"
    | "update"
    | "delete"
    | "import"; // Action type
  resource: string; // The resource involved in the action
  resourceId: string; // ID of the resource
  userId: string; // ID of the user who performed the action
  userName: string; // Name of the user
  description: string; // Description of the action
  status: "success" | "failure"; // Status of the action
  ipAddress: string; // IP address from which the action was performed
  performBy: "admin" | "teacher" | "student"; // Role of the user who performed the action
  createdAt: string; // Timestamp of when the log was created
  updatedAt: string; // Timestamp of when the log was last updated
  __v: number; // Version key (used by MongoDB)
}

export interface IActivityLogsResponse {
  currentLogsCount: number; // The number of logs on the current page
  currentPage: number; // The current page number
  hasNextPage: boolean; // Indicates if there is a next page
  hasPreviousPage: boolean; // Indicates if there is a previous page
  limit: number; // The limit of logs per page
  message: string; // Status message for the fetch operation
  page: number; // Current page number (for consistency)
  totalLogs: number; // Total number of logs available
  totalPages: number; // Total number of pages available
  activityLogs: IActivityLog[]; // Array of activity log entries (using the IActivityLog interface)
}
