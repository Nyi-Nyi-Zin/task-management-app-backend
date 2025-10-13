import { Router } from "express";
import cardController from "../controllers/card";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Create a new card
router.post("/cards", protect, cardController.createCard);

// ✅ Get all cards for a list
router.get("/lists/:listId/cards", protect, cardController.getAllCards);

// ✅ Get single card by ID
router.get("/cards/:cardId", protect, cardController.getOldCardData);

// ✅ Update card
router.put("/cards/:cardId", protect, cardController.updateCard);

// ✅ Delete card
router.delete("/cards/:cardId", protect, cardController.deleteCard);

router.patch("/toggle", protect, cardController.toggleCardDone);

export default router;
