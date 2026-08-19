import { Request, Response } from "express";
import { UserService } from "./users.service";

const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("REQ BODY:", req.body);

    const result =
      await UserService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(
      "User creation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "User creation failed",
      code: error.code,
      meta: error.meta,
    });
  }
};


const getUserByUid = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await UserService.getUserByUid(
        req.params.uid as string
      );

    res.status(200).json({
      success: true,
      message:
        "User fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "User fetch failed",
    });
  }
};


const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await UserService.updateUser(
        req.params.uid as string,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "User update failed",
    });
  }
};


export const UserController = {
  createUser,
  getUserByUid,
  updateUser,
};