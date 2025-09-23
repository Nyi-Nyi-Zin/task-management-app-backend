const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const router = Router();

const listController = require("../controllers/list");

//get all lists by boardId
router.get("/get-lists/:boardId", authMiddleware, listController.getAllLists);

//create new list
router.post("/board/create-list", authMiddleware, listController.createList);

//update list
router.put(
  "/board/update-list/:listId",
  authMiddleware,
  listController.updateList
);

//fetch old list title
router.get(
  "/board/get-old-list-title/:listId",
  authMiddleware,
  listController.getOldListTitle
);

//delete list
router.delete(
  "/board/delete-list/:id",
  authMiddleware,
  listController.deleteList
);

module.exports = router;
