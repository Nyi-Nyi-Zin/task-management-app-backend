// routes/card.ts
import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import cardController from "../controllers/card";

const router = Router();

// Create new card
router.post("/board/list/create-card", protect, cardController.createCard);

// Fetch all cards for a list
router.get("/board/:listId/cards", protect, cardController.getAllCards);

// Fetch old card title
router.get(
  "/board/list/get-old-card-title/:cardId",
  protect,
  cardController.getOldCardData
);

// Update card
router.put(
  "/board/list/update-card/:cardId",
  protect,
  cardController.updateCard
);

// Delete card
router.delete(
  "/board/list/delete-card/:cardId",
  protect,
  cardController.deleteCard
);

// Add card description (optional)
// router.post("/board/list/create-card-desc", authMiddleware, cardController.createDesc);

export default router;
