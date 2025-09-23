const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

const boardController = require("../controllers/board");

const router = Router();

//get all boards
router.get("/get-boards", authMiddleware, boardController.getAllBoards);

//create new board
router.post("/create-board", authMiddleware, boardController.createBoard);

//update board
router.put("/update-board/:id", authMiddleware, boardController.updateBoard);

//delete board
router.delete("/delete-board/:id", authMiddleware, boardController.deleteBoard);

//fetch old board title
// router.get(
//   "/get-old-board-title/:id",
//   authMiddleware,
//   boardController.fetchOldBoardTitle
// );

//get single board by id
router.get("/get-board/:id", authMiddleware, boardController.getSingleBoard);

module.exports = router;
