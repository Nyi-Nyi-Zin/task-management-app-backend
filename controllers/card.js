const Card = require("../models/card");

// Create a new card
exports.createcard = async (req, res) => {
  const { title, listId } = req.body;

  try {
    const newCard = await Card.create({
      title,
      listId,
    });
    return res.status(201).json({
      message: "Card created successfully",
      isSuccess: true,
      Card: newCard,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating Card",
      error: error,
    });
  }
};

// Fetch all cards
exports.getAllCards = async (req, res) => {
  const { listId } = req.params;

  try {
    const cards = await Card.findAll({
      where: { listId },
    });

    return res.status(200).json({
      message: "Cards fetched successfully",
      isSuccess: true,
      cards,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Cards",
      error: error,
    });
  }
};

//get old card data
exports.getOldCardData = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findOne({
      where: { id: cardId },
    });
    if (!card) {
      return res.status(404).json({
        message: "Card not found",
        isSuccess: false,
      });
    }

    return res.status(200).json({
      message: "Card title fetched successfully",
      isSuccess: true,
      cardTitle: card.title,
      cardDesc: card.description,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Card title",
      error: error,
    });
  }
};

// Update card
exports.updateCard = async (req, res) => {
  const { cardId } = req.params;
  const { title, description } = req.body;

  try {
    const card = await Card.findOne({
      where: { id: cardId },
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
        isSuccess: false,
      });
    }

    await Card.update({ title, description }, { where: { id: cardId } });

    return res.status(200).json({
      message: "Card updated successfully",
      isSuccess: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating Card",
      error: error,
    });
  }
};

//delete card
exports.deleteCard = async (req, res) => {
  const id = req.params.cardId;

  try {
    const cardDoc = await Card.findOne({ where: { id } });

    if (!cardDoc) {
      return res.status(404).json({
        message: "Card not found",
        isSuccess: false,
      });
    }
    await Card.destroy({ where: { id } });
    return res.status(200).json({
      message: "Card deleted successfully",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//add card desc
// exports.createDesc = async (req, res) => {
//   const { description, cardId } = req.body;

//   try {
//     const cardDoc = await Card.findOne({
//       where: { id: cardId },
//     });

//     if (!cardDoc) {
//       return res.status(404).json({
//         message: "Card not found",
//         isSuccess: false,
//       });
//     }

//     await Card.update(
//       { description },
//       {
//         where: {
//           id: cardId,
//         },
//       }
//     );
//     return res.status(200).json({
//       message: "Card updated successfully",
//       isSuccess: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error updating Card",
//       error: error,
//     });
//   }
// };
