import { Router } from "express";
import listController from "../controllers/list";
import { protect } from "../middlewares/authMiddleware";
import list from "../controllers/list";

const router = Router();

// ✅ Get all lists for a specific board
router.get("/boards/:boardId/lists", protect, listController.getAllLists);

// ✅ Create a new list under a specific board
router.post("/boards/:boardId/lists", protect, listController.createList);

// ✅ Get a single list by ID under a specific board
router.get(
  "/boards/:boardId/lists/:listId",
  protect,
  listController.getListById
);

// ✅ Update a list by ID under a specific board
router.put(
  "/boards/:boardId/lists/:listId",
  protect,
  listController.updateList
);

// ✅ Delete a list by ID under a specific board
router.delete(
  "/boards/:boardId/lists/:listId",
  protect,
  listController.deleteList
);

export default router;
