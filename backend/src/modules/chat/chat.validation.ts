import { z } from "zod";

export const sendMessageSchema = z.object({
  uid: z.string().min(1),
  message: z.string().min(1),
});
