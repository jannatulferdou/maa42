
import express from "express";

import {
  createContact,
  deleteContact,
  getContacts,
  toggleFavorite,
  updateContact,
} from "./emergency.controller";

const router = express.Router();

router.post("/", createContact);

router.get("/:userId", getContacts);

router.patch("/:id", updateContact);

router.delete("/:id", deleteContact);

router.patch(
  "/favorite/:id",
  toggleFavorite
);

export default router;

