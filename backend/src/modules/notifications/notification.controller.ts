import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "./notification.validation";

const createNotification = async (req: Request, res: Response) => {
  try {
    const payload = createNotificationSchema.parse(req.body) as Parameters<
      typeof NotificationService.createNotification
    >[0];

    const result = await NotificationService.createNotification(payload);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create notification",
    });
  }
};

const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const result = await NotificationService.getUserNotifications(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get notifications",
    });
  }
};

const updateNotification = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = updateNotificationSchema.parse(req.body);

    // Remove properties with undefined to satisfy exactOptionalPropertyTypes
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    ) as Partial<typeof payload>;

    const result = await NotificationService.updateNotification(id, filteredPayload as any);

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update notification",
    });
  }
};

const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await NotificationService.deleteNotification(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete notification",
    });
  }
};

export const NotificationController = {
  createNotification,
  getUserNotifications,
  updateNotification,
  deleteNotification,
};