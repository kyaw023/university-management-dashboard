import fs from "fs";
import { Request, Response } from "express";
import Event from "../models/Event";
import mongoose from "mongoose";
import parseCSV from "../helper/pareseCSV";
import parseExcel from "../helper/parseExcel";
import { logActivity } from "../helper/logActivity";

export const getAllEvents = async (req: any, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    const events = await Event.find()
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({
      events,
      page,
      limit,
      totalPages,
      totalEvents,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting events",
      error: error,
    });
  }
};

export const getEventById = async (req: any, res: Response) => {
  const eventId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const isExisted = await Event.findById(eventId);

    if (!isExisted) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: "Error getting event",
      error: error,
    });
  }
};

export const createEvent = async (req: any, res: Response) => {
  const event = await Event.create(req.body);
  try {
    await logActivity({
      action: "create",
      resource: "Event",
      resourceId: event._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Created event: ${event.title}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(201).json(event);
  } catch (error) {
    await logActivity({
      action: "create",
      resource: "Event",
      resourceId: event._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Created event: ${req.body.title}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(500).json({
      message: "Error creating event",
      error: error,
    });
  }
};

export const updateEvent = async (req: any, res: Response) => {
  const eventId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const isExisted = await Event.findById(eventId);

    if (!isExisted) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const event = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await logActivity({
      action: "update",
      resource: "Event",
      resourceId: event._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Updated event: ${event.title}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json(event);
  } catch (error) {
    await logActivity({
      action: "update",
      resource: "Event",
      resourceId: eventId,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Error updating event: ${eventId}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(500).json({
      message: "Error updating event",
      error: error,
    });
  }
};

export const deleteEvent = async (req: any, res: Response) => {
  const eventId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const isExisted = await Event.findById(eventId);
    if (!isExisted) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await logActivity({
      action: "delete",
      resource: "Event",
      resourceId: event._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Deleted event: ${event.title}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json(event);
  } catch (error) {
    await logActivity({
      action: "delete",
      resource: "Event",
      resourceId: eventId,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Error deleting event: ${eventId}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(500).json({
      message: "Error deleting event",
      error: error,
    });
  }
};

export const importEvents = async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase();
  const filePath = req.file.path;

  try {
    let dataToInsert: any[] = [];

    if (fileExtension === "csv") {
      dataToInsert = await parseCSV(filePath);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      dataToInsert = await parseExcel(filePath);
    } else {
      throw new Error("Unsupported file format");
    }

    const totalRecords = dataToInsert.length;
    let processedRecords = 0;

    for (const item of dataToInsert) {
      // Parse attendees if it's a string
      if (typeof item.attendees === "string") {
        item.attendees = JSON.parse(item.attendees);
      }

      // Convert attendeeId strings to ObjectId
      item.attendees = item.attendees.map((attendee: any) => ({
        ...attendee,
        attendeeId: new mongoose.Types.ObjectId(attendee.attendeeId),
      }));

      // Convert date strings to Date objects
      item.date = new Date(item.date);
      item.createdAt = new Date(item.createdAt);

      // Create the event
      await Event.create(item);
      processedRecords++;
    }

    await logActivity({
      action: "import",
      resource: "Event",
      userId: req.user._id,
      resourceId: req.user._id,
      userName: req.user.name,
      description: `Imported ${totalRecords} events`,
      status: "success",
      ipAddress: req.ip,
      performBy: "admin",
    });

    const progress = Math.round((processedRecords / totalRecords) * 100);
    res.json({ progress, message: "Events imported successfully" });
  } catch (error: any) {
    await logActivity({
      action: "import",
      resource: "Event",
      userId: req.user._id,
      resourceId: req.user._id,
      userName: req.user.name,
      description: `Import error: ${error}`,
      status: "failed",
      ipAddress: req.ip,
      performBy: "admin",
    });
    console.error("Import error:", error);
    res.status(500).json({
      message: "An error occurred during import",
      error: error.message,
    });
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
};
