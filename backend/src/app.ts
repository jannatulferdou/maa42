import express, { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./modules/users/users.route";
import { NotificationRoutes } from "./modules/notifications/notification.route";
import { CheckinRoutes } from "./modules/checkins/checkin.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("MedSophia Maa42 Backend is running");
});
app.use("/api/v1/users",UserRoutes);
app.use("/api/v1/notifications", NotificationRoutes);
app.use("/api/v1/checkins", CheckinRoutes);
export default app;