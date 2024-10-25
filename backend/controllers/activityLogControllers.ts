import { Request, Response } from "express";
import ActivityLogSchema from "../models/ActivityLogSchema";

export const getActivityLogs = async (req: Request, res: Response) => {
  console.log(req.query.page, req.query.limit);
  try {
    // Parse and validate query params
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const search = req.query.search || "";

    // Fetch total logs count
    const totalLogs = await ActivityLogSchema.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);

    const searchQuery = {
      $or: [
        { action: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        
      ],
    };

    // Fetch logs with pagination
    const activityLogs = await ActivityLogSchema.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: "Activity logs fetched successfully",
      activityLogs,
      page,
      limit,
      totalPages,
      totalLogs,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      currentLogsCount: activityLogs.length, // New field: Logs fetched in the current response
      currentPage: page,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching activity logs:", error.message);
      return res.status(500).json({
        message: "Failed to fetch activity logs",
        error: error.message,
      });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }
};
