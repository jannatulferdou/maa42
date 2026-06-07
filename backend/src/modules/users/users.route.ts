import { Router } from "express";
import { UserController } from "./users.controller";

const router = Router();

router.post(
  "/",
  UserController.createUser
);
router.get("/:uid", UserController.getUserByUid);

export const UserRoutes = router;