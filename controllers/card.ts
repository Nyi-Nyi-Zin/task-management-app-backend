// controllers/card.ts
import { Request, Response } from "express";
import Card from "../models/card";

// Extend Request to include any auth info if needed
interface AuthRequest extends Request {
  userId?: number; // optional, in case you have auth middleware
}

// Create a new card
const createCard = async (req: AuthRequest, res: Response) => {
  const { title, listId } = req.body;

  try {
    const newCard = await Card.create({ title, listId });
    return res.status(201).json({
      message: "Card created successfully",
      isSuccess: true,
      card: newCard,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Error creating Card", error });
  }
};

// Fetch all cards for a list
const getAllCards = async (req: Request, res: Response) => {
  const { listId } = req.params;

  try {
    const cards = await Card.findAll({ where: { listId } });
    return res.status(200).json({
      message: "Cards fetched successfully",
      isSuccess: true,
      cards,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching Cards", error });
  }
};

// Get old card data
const getOldCardData = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findOne({ where: { id: cardId } });
    if (!card)
      return res
        .status(404)
        .json({ message: "Card not found", isSuccess: false });

    return res.status(200).json({
      message: "Card title fetched successfully",
      isSuccess: true,
      cardTitle: card.title,
      cardDesc: card.description,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error fetching Card title", error });
  }
};

// Update card
const updateCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { title, description } = req.body;

  try {
    const card = await Card.findOne({ where: { id: cardId } });
    if (!card)
      return res
        .status(404)
        .json({ message: "Card not found", isSuccess: false });

    await Card.update({ title, description }, { where: { id: cardId } });
    return res
      .status(200)
      .json({ message: "Card updated successfully", isSuccess: true });
  } catch (error: any) {
    return res.status(500).json({ message: "Error updating Card", error });
  }
};

// Delete card
const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const cardDoc = await Card.findOne({ where: { id: cardId } });
    if (!cardDoc)
      return res
        .status(404)
        .json({ message: "Card not found", isSuccess: false });

    await Card.destroy({ where: { id: cardId } });
    return res
      .status(200)
      .json({ message: "Card deleted successfully", isSuccess: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  createCard,
  getAllCards,
  getOldCardData,
  updateCard,
  deleteCard,
};
