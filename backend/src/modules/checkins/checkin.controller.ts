import { Request, Response } from "express";
import { CheckinService } from "./checkin.service";

export const CheckinController = {
  createCheckin: async (req: Request, res: Response) => {
    try {
      const data = await CheckinService.createCheckin(req.body);

      res.status(201).json({
        success: true,
        message: "Health checkin submitted successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  },

  getUserCheckins: async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const data = await CheckinService.getUserCheckins(userId);

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  },
};