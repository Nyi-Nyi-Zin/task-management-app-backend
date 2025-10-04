// routes/list.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import listController from "../controllers/list";

const router = Router();

// Get all lists by boardId
router.get("/get-lists/:boardId", authMiddleware, listController.getAllLists);

// Create new list
router.post("/board/create-list", authMiddleware, listController.createList);

// Update list
router.put(
  "/board/update-list/:listId",
  authMiddleware,
  listController.updateList
);

// Fetch old list title
router.get(
  "/board/get-old-list-title/:listId",
  authMiddleware,
  listController.getOldListTitle
);

// Delete list
router.delete(
  "/board/delete-list/:id",
  authMiddleware,
  listController.deleteList
);

export default router;
