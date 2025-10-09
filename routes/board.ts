// routes/board.ts
import { Router } from "express";
import boardController from "../controllers/board";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Get all boards
router.get("/get-boards", protect, boardController.getAllBoards);

// Create new board
router.post("/create-board", protect, boardController.createBoard);

// Update board
router.put("/update-board/:id", protect, boardController.updateBoard);

// Delete board
router.delete("/delete-board/:id", protect, boardController.deleteBoard);

// Get single board by id
router.get("/get-board/:id", protect, boardController.getSingleBoard);

export default router;
