import express from "express";
import { CheckinController } from "./checkin.controller";

const router = express.Router();

router.post("/", CheckinController.createCheckin);
router.get("/user/:userId", CheckinController.getUserCheckins);

export const CheckinRoutes = router;