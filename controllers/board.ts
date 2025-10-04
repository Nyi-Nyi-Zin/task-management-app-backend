import { Request, Response } from "express";
import Board from "../models/board";
import List from "../models/list";
import Card from "../models/card";
import User from "../models/user";

// Extend Request for authenticated routes
interface AuthRequest extends Request {
  userId?: number;
}

const createBoard = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.userId;

  if (!userId)
    return res
      .status(400)
      .json({ message: "User ID is required", isSuccess: false });

  if (!title || title.trim() === "")
    return res
      .status(400)
      .json({ message: "Title cannot be empty.", isSuccess: false });

  try {
    await Board.create({ title, userId });
    return res
      .status(201)
      .json({ message: "Board created successfully", isSuccess: true });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error creating board", error, isSuccess: false });
  }
};

const getAllBoards = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
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
    return res
      .status(500)
      .json({ message: "Error fetching boards", error, isSuccess: false });
  }
};

const updateBoard = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  if (!title || title.trim() === "")
    return res
      .status(400)
      .json({ message: "Title cannot be empty.", isSuccess: false });

  try {
    const board = await Board.findOne({ where: { id } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });
    if (board.getDataValue("userId") !== userId)
      return res
        .status(403)
        .json({ message: "Not authorized", isSuccess: false });

    await Board.update({ title }, { where: { id } });
    return res
      .status(200)
      .json({ message: "Board updated successfully", isSuccess: true });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error updating board", error, isSuccess: false });
  }
};

const deleteBoard = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const board = await Board.findOne({ where: { id } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });

    await Board.destroy({ where: { id } });
    return res
      .status(200)
      .json({ message: "Board deleted successfully", isSuccess: true });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error deleting board", error, isSuccess: false });
  }
};

const getSingleBoard = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const board = await Board.findOne({
      where: { id },
      include: [
        { model: List, as: "lists", include: [{ model: Card, as: "cards" }] },
        { model: User, as: "user", attributes: ["id", "email"] },
      ],
      order: [
        [{ model: List, as: "lists" }, "createdAt", "ASC"],
        [
          { model: List, as: "lists" },
          { model: Card, as: "cards" },
          "createdAt",
          "ASC",
        ],
      ],
    });

    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", isSuccess: false });

    return res
      .status(200)
      .json({ message: "Board fetched successfully", board, isSuccess: true });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching board",
      error: error.message,
      isSuccess: false,
    });
  }
};

export default {
  createBoard,
  getAllBoards,
  updateBoard,
  deleteBoard,
  getSingleBoard,
};
