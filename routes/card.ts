// routes/card.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import cardController from "../controllers/card";

const router = Router();

// Create new card
router.post(
  "/board/list/create-card",
  authMiddleware,
  cardController.createCard
);

// Fetch all cards for a list
router.get("/board/:listId/cards", authMiddleware, cardController.getAllCards);

// Fetch old card title
router.get(
  "/board/list/get-old-card-title/:cardId",
  authMiddleware,
  cardController.getOldCardData
);

// Update card
router.put(
  "/board/list/update-card/:cardId",
  authMiddleware,
  cardController.updateCard
);

// Delete card
router.delete(
  "/board/list/delete-card/:cardId",
  authMiddleware,
  cardController.deleteCard
);

// Add card description (optional)
// router.post("/board/list/create-card-desc", authMiddleware, cardController.createDesc);

export default router;
