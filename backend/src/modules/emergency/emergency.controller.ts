import { Request, Response } from "express";
import { EmergencyServices } from "./emergency.service";

export const createContact = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await EmergencyServices.createContact(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create contact",
    });
  }
};

export const getContacts = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const result =
      await EmergencyServices.getContacts(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

export const updateContact = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result =
      await EmergencyServices.updateContact(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await EmergencyServices.deleteContact(id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};