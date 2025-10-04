// controllers/list.ts
import { Request, Response } from "express";
import List from "../models/list";

interface AuthRequest extends Request {
  userId?: number;
}

const createList = async (req: AuthRequest, res: Response) => {
  const { title, boardId } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title cannot be empty.",
      isSuccess: false,
    });
  }

  try {
    const newList = await List.create({ title, boardId });
    return res.status(201).json({
      message: "List created successfully",
      isSuccess: true,
      list: newList,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating List",
      error,
    });
  }
};

// Get all lists for a board
const getAllLists = async (req: Request, res: Response) => {
  const { boardId } = req.params;

  try {
    const lists = await List.findAll({
      where: { boardId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      message: "Lists fetched successfully",
      lists,
      isSuccess: true,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching lists",
      error,
      isSuccess: false,
    });
  }
};

// Update a list by ID
const updateList = async (req: Request, res: Response) => {
  const { title } = req.body;
  const { listId } = req.params;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title cannot be empty.",
      isSuccess: false,
    });
  }

  try {
    const list = await List.findOne({ where: { id: listId } });
    if (!list) {
      return res
        .status(404)
        .json({ message: "List not found", isSuccess: false });
    }

    await List.update({ title }, { where: { id: listId } });
    res
      .status(200)
      .json({ message: "List updated successfully", isSuccess: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Delete a list by ID
const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const listDoc = await List.findOne({ where: { id } });
    if (!listDoc) {
      return res
        .status(404)
        .json({ message: "List not found", isSuccess: false });
    }

    await List.destroy({ where: { id } });
    res
      .status(200)
      .json({ message: "List deleted successfully", isSuccess: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch old list title
const getOldListTitle = async (req: Request, res: Response) => {
  const { listId } = req.params;

  try {
    const list = await List.findByPk(listId);
    if (!list) {
      return res
        .status(404)
        .json({ message: "List not found", isSuccess: false });
    }
    res
      .status(200)
      .json({ isSuccess: true, title: list.getDataValue("title") });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createList,
  getAllLists,
  updateList,
  deleteList,
  getOldListTitle,
};
