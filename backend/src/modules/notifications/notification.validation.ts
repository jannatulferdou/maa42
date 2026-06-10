import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  type: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  type: z.string().optional(),
  isRead: z.boolean().optional(),
});