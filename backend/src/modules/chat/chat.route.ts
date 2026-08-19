import express from "express";
import { ChatController } from "./chat.controller";

const router = express.Router();

router.post("/message", ChatController.sendMessage);
router.get("/current/:uid", ChatController.getCurrent);
router.get("/sessions/:uid", ChatController.getSessions);
router.get("/sessions/messages/:sessionId", ChatController.getSessionMessages);

export const ChatRoutes = router;
