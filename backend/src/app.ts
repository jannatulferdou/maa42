import express, { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./modules/users/users.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("MedSophia Maa42 Backend is running");
});
app.use("/api/v1/users",UserRoutes);
export default app;