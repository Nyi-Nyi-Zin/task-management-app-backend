const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const router = Router();

const cardController = require("../controllers/card");

//create new card
router.post(
  "/board/list/create-card",
  authMiddleware,
  cardController.createcard
);

//fetch all cards
router.get("/board/:listId/cards", authMiddleware, cardController.getAllCards);

//fetch old card title
router.get(
  "/board/list/get-old-card-title/:cardId",
  authMiddleware,
  cardController.getOldCardData
);

//update card
router.put(
  "/board/list/update-card/:cardId",
  authMiddleware,
  cardController.updateCard
);

//delete card
router.delete(
  "/board/list/delete-card/:cardId",
  authMiddleware,
  cardController.deleteCard
);

//add card desc
// router.post(
//   "/board/list/create-card-desc",
//   authMiddleware,
//   cardController.createDesc
// );

module.exports = router;
