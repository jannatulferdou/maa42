
import { Request, Response } from "express";
import { EmergencyServices } from "./emergency.service";

export const createContact = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await EmergencyServices.createContact(
      req.body
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

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
    const uid = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!uid) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const result =
      await EmergencyServices.getContacts(uid);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

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
  } catch (error) {
    console.log(error);

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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const toggleFavorite = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result =
      await EmergencyServices.toggleFavorite(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Favorite update failed",
    });
  }
};
