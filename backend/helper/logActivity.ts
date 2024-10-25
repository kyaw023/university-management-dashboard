import ActivityLogSchema from "../models/ActivityLogSchema";

// Define an interface for logging activity parameters
interface ILogActivityParams {
  action:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "import"
    | "login"
    | "logout"; // Use specific actions as an enum
  resource: string;
  resourceId: string;
  userId: string;
  userName: string;
  description: string;
  status: "success" | "failed" | "partial_success"; // Define expected statuses
  ipAddress: string; // Consider validating this
  performBy: "admin" | "teacher" | "student";
}

export const logActivity = async ({
  action,
  resource,
  resourceId,
  userId,
  userName,
  description,
  status,
  ipAddress,
  performBy,
}: ILogActivityParams) => {
  try {
    await ActivityLogSchema.create({
      action,
      resource,
      resourceId,
      userId,
      userName,
      description,
      status,
      ipAddress,
      performBy,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Optionally, implement further error handling, e.g., logging to a file or a monitoring system
  }
};
