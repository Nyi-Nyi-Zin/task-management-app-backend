import { Request, Response } from "express";
import Board from "../models/board";
import List from "../models/list";
import Card from "../models/card";
import { User } from "../models/user";

interface IUserPayload {
  id: number;
  name: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

// ✅ Create Board
const createBoard = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.user?.id;

  if (!userId)
    return res
      .status(400)
      .json({ message: "User ID is required", isSuccess: false });

  if (!title?.trim())
    return res
      .status(400)
      .json({ message: "Title cannot be empty.", isSuccess: false });

  try {
    const newBoard = await Board.create({ title, userId });
    return res.status(201).json({
      message: "Board created successfully",
      data: newBoard,
      isSuccess: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating board",
      error: error.message,
      isSuccess: false,
    });
  }
};

// ✅ Get All Boards (by user)
const getAllBoards = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId)
    return res
      .status(400)
      .json({ message: "User ID is required", isSuccess: false });

  try {
    const boards = await Board.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      message: "Boards fetched successfully",
      data: boards,
      isSuccess: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching boards",
      error: error.message,
      isSuccess: false,
    });
  }
};

const getSingleBoard = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "User not authenticated", isSuccess: false });
  }

  const boardId = Number(id);
  if (isNaN(boardId)) {
    return res
      .status(400)
      .json({ message: "Invalid board ID", isSuccess: false });
  }

  try {
    const board = await Board.findOne({
      where: { id: boardId, userId },
      include: [
        {
          model: List,
          as: "lists",
          include: [
            {
              model: Card,
              as: "cards",
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });

    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });
    }

    // Sort lists by id
    board.lists.sort((a, b) => a.id - b.id);

    // Sort cards inside each list by id
    board.lists.forEach((list) => {
      list.cards.sort((a, b) => a.id - b.id);
    });

    return res.status(200).json({
      message: "Board fetched successfully",
      data: board,
      isSuccess: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching board",
      error: error.message,
      isSuccess: false,
    });
  }
};

// ✅ Update Board (only if belongs to user)
const updateBoard = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;

  if (!title?.trim())
    return res
      .status(400)
      .json({ message: "Title cannot be empty.", isSuccess: false });

  try {
    const board = await Board.findOne({ where: { id, userId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });

    await board.update({ title });

    return res.status(200).json({
      message: "Board updated successfully",
      data: board,
      isSuccess: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating board",
      error: error.message,
      isSuccess: false,
    });
  }
};

// ✅ Delete Board (only if belongs to user)
const deleteBoard = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({ where: { id, userId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });

    await Board.destroy({ where: { id } });

    return res.status(200).json({
      message: "Board deleted successfully",
      isSuccess: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting board",
      error: error.message,
      isSuccess: false,
    });
  }
};

export default {
  createBoard,
  getAllBoards,
  getSingleBoard,
  updateBoard,
  deleteBoard,
};
