// routes/board.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import boardController from "../controllers/board";

const router = Router();

// Get all boards
router.get("/get-boards", authMiddleware, boardController.getAllBoards);

// Create new board
router.post("/create-board", authMiddleware, boardController.createBoard);

// Update board
router.put("/update-board/:id", authMiddleware, boardController.updateBoard);

// Delete board
router.delete("/delete-board/:id", authMiddleware, boardController.deleteBoard);

// Get single board by id
router.get("/get-board/:id", authMiddleware, boardController.getSingleBoard);

export default router;
