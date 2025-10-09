import { Router } from "express";
import listController from "../controllers/list";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/get-lists/:boardId", protect, listController.getAllLists);

// Create new list
router.post("/board/create-list", protect, listController.createList);

// Update list
router.put("/board/update-list/:listId", protect, listController.updateList);

// Fetch old list title
router.get(
  "/board/get-old-list-title/:listId",
  protect,
  listController.getOldListTitle
);

// Delete list
router.delete("/board/delete-list/:id", protect, listController.deleteList);

export default router;
