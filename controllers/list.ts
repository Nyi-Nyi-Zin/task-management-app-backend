import { Request, Response } from "express";
import List from "../models/list";
import Board from "../models/board";
import Card from "../models/card";

interface AuthRequest extends Request {
  user?: { id: number };
}

// ✅ Create a new list
const createList = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const boardId = Number(req.params.boardId);
  const userId = req.user?.id;

  if (!title?.trim())
    return res
      .status(400)
      .json({ isSuccess: false, message: "Title cannot be empty." });
  if (isNaN(boardId))
    return res
      .status(400)
      .json({ isSuccess: false, message: "Invalid board ID." });

  try {
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied." });

    const newList = await List.create({ title: title.trim(), boardId });

    return res.status(201).json({
      isSuccess: true,
      message: "List created successfully",
      data: newList,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error creating list",
      error: error.message,
    });
  }
};

// ✅ Get all lists under a board
const getAllLists = async (req: AuthRequest, res: Response) => {
  const boardId = Number(req.params.boardId);
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied." });

    const lists = await List.findAll({
      where: { boardId },
      include: [{ model: Card, as: "cards" }],
      order: [
        ["createdAt", "ASC"],
        [{ model: Card, as: "cards" }, "createdAt", "ASC"],
      ],
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Lists fetched successfully",
      data: lists,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error fetching lists",
      error: error.message,
    });
  }
};

// ✅ Get single list
const getListById = async (req: AuthRequest, res: Response) => {
  const boardId = Number(req.params.boardId);
  const listId = Number(req.params.listId);
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied." });

    const list = await List.findOne({
      where: { id: listId, boardId },
      include: [{ model: Card, as: "cards" }],
    });
    if (!list)
      return res
        .status(404)
        .json({ isSuccess: false, message: "List not found" });

    return res.status(200).json({
      isSuccess: true,
      message: "List fetched successfully",
      data: list,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error fetching list",
      error: error.message,
    });
  }
};

// ✅ Update list (title only)
const updateList = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const boardId = Number(req.params.boardId);
  const listId = Number(req.params.listId);
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied." });

    const list = await List.findOne({ where: { id: listId, boardId } });
    if (!list)
      return res
        .status(404)
        .json({ isSuccess: false, message: "List not found" });

    await list.update({ title: title || list.title });

    return res.status(200).json({
      isSuccess: true,
      message: "List updated successfully",
      data: list,
    });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error updating list",
      error: error.message,
    });
  }
};

// ✅ Delete list
const deleteList = async (req: AuthRequest, res: Response) => {
  const boardId = Number(req.params.boardId);
  const listId = Number(req.params.listId);
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({ where: { id: boardId, userId } });
    if (!board)
      return res
        .status(403)
        .json({ isSuccess: false, message: "Access denied." });

    const list = await List.findOne({ where: { id: listId, boardId } });
    if (!list)
      return res
        .status(404)
        .json({ isSuccess: false, message: "List not found" });

    await list.destroy();
    return res
      .status(200)
      .json({ isSuccess: true, message: "List deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      isSuccess: false,
      message: "Error deleting list",
      error: error.message,
    });
  }
};

export default {
  createList,
  getAllLists,
  getListById,
  updateList,
  deleteList,
};
