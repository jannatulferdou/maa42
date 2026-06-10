import express from "express";
import { NotificationController } from "./notification.controller";

const router = express.Router();

router.post("/", NotificationController.createNotification);

router.get("/:userId", NotificationController.getUserNotifications);

router.patch("/:id", NotificationController.updateNotification);

router.delete("/:id", NotificationController.deleteNotification);

export const NotificationRoutes = router;