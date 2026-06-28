import express from "express";
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from "./emergency.controller";

const router = express.Router();

router.post("/", createContact);

router.get("/:userId", getContacts);

router.patch("/:id", updateContact);

router.delete("/:id", deleteContact);

export default router;