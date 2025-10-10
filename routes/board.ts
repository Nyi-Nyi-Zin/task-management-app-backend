// routes/board.ts
import { Router } from "express";
import boardController from "../controllers/board";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Get all boards
router.get("/boards", protect, boardController.getAllBoards);

// Create new board
router.post("/boards", protect, boardController.createBoard);

// Update board
router.put("/boards/:id", protect, boardController.updateBoard);

// Delete board
router.delete("/boards/:id", protect, boardController.deleteBoard);

// Get single board by id
router.get("/boards/:id", protect, boardController.getSingleBoard);

export default router;
