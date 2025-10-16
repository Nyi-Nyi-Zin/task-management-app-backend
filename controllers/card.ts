import { Request, Response } from "express";
import Card, { CardInstance } from "../models/card";
import List, { ListInstance } from "../models/list";
import Board, { BoardInstance } from "../models/board";

interface AuthRequest extends Request {
  user?: { id: number };
}

// ✅ Create a new card
const createCard = async (req: AuthRequest, res: Response) => {
  const { title, listId, description } = req.body;
  const userId = req.user?.id;

  if (!title?.trim() || !listId) {
    return res.status(400).json({
      isSuccess: false,
      message: "Title and listId are required.",
    });
  }

  const listIdNum = Number(listId);
  if (isNaN(listIdNum)) {
    return res
      .status(400)
      .json({ isSuccess: false, message: "Invalid listId" });
  }

  try {
    const list = (await List.findOne({
      where: { id: listIdNum },
    })) as ListInstance;
    if (!list)
      return res
        .status(404)
        .json({ isSuccess: false, message: "List not found" });

    const board = (await Board.findOne({
      where: { id: list.boardId, userId },
    })) as BoardInstance;
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied" });

    const newCard = await Card.create({
      title: title.trim(),
      description: description || null,
      listId: listIdNum,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Card created successfully",
      card: newCard,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error creating card",
      error: error.message,
    });
  }
};

// ✅ Get all cards for a list
const getAllCards = async (req: AuthRequest, res: Response) => {
  const { listId } = req.body;
  const userId = req.user?.id;

  if (!listId)
    return res
      .status(400)
      .json({ isSuccess: false, message: "listId is required" });

  const listIdNum = Number(listId);
  try {
    const list = (await List.findOne({
      where: { id: listIdNum },
    })) as ListInstance;
    if (!list)
      return res
        .status(404)
        .json({ isSuccess: false, message: "List not found" });

    const board = (await Board.findOne({
      where: { id: list.boardId, userId },
    })) as BoardInstance;
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied" });

    const cards = await Card.findAll({
      where: { listId: listIdNum },
      order: [["createdAt", "ASC"]],
    });

    return res
      .status(200)
      .json({ isSuccess: true, message: "Cards fetched successfully", cards });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error fetching cards",
      error: error.message,
    });
  }
};

// ✅ Get old card data
const getOldCardData = async (req: AuthRequest, res: Response) => {
  const cardIdNum = Number(req.params.cardId);
  try {
    const card = (await Card.findOne({
      where: { id: cardIdNum },
    })) as CardInstance;
    if (!card)
      return res
        .status(404)
        .json({ isSuccess: false, message: "Card not found" });

    return res.status(200).json({
      isSuccess: true,
      message: "Card fetched successfully",
      cardTitle: card.title,
      cardDesc: card.description,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error fetching card",
      error: error.message,
    });
  }
};

// ✅ Update card (title/description only)
const updateCard = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const { cardId } = req.params; // get from param

  if (!cardId)
    return res
      .status(400)
      .json({ isSuccess: false, message: "cardId is required." });

  try {
    const card = await Card.findOne({ where: { id: Number(cardId) } });
    if (!card)
      return res
        .status(404)
        .json({ isSuccess: false, message: "Card not found." });

    const updatedFields: any = {};
    if (title?.trim()) updatedFields.title = title.trim();
    if (description !== undefined) updatedFields.description = description;

    await card.update(updatedFields);

    return res.status(200).json({
      isSuccess: true,
      message: "Card updated successfully.",
      data: card,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error updating card.",
      error: error.message,
    });
  }
};

// ✅ Delete card
const deleteCard = async (req: AuthRequest, res: Response) => {
  const cardIdNum = Number(req.params.cardId);
  try {
    const card = (await Card.findOne({
      where: { id: cardIdNum },
    })) as CardInstance;
    if (!card)
      return res
        .status(404)
        .json({ isSuccess: false, message: "Card not found" });

    await card.destroy();
    return res
      .status(200)
      .json({ isSuccess: true, message: "Card deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error deleting card",
      error: error.message,
    });
  }
};

export const toggleCardDone = async (req: Request, res: Response) => {
  const { id } = req.body; // ✅ get id from body instead of params

  try {
    if (!id) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Card ID is required" });
    }

    const card = await Card.findByPk(id);
    if (!card) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Card not found" });
    }

    // ✅ Toggle isDone
    const newIsDone = !card.getDataValue("isDone");
    await card.update({ isDone: newIsDone });

    return res.json({
      isSuccess: true,
      message: "Card toggled successfully",
      card,
    });
  } catch (error) {
    console.error("Error toggling card:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error toggling card status",
    });
  }
};

export default {
  createCard,
  getAllCards,
  getOldCardData,
  updateCard,
  deleteCard,
  toggleCardDone,
};
