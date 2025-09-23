const List = require("../models/list");

// Create a new list
exports.createList = async (req, res) => {
  const { title, boardId } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title  cannot be empty.",
      isSuccess: false,
    });
  }

  try {
    const newList = await List.create({
      title,
      boardId,
    });
    return res.status(201).json({
      message: "List created successfully",
      isSuccess: true,
      list: newList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating List",
      error: error,
    });
  }
};

// Get all lists
exports.getAllLists = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lists",
      error: error,
      isSuccess: false,
    });
  }
};

// Update a list by ID
exports.updateList = async (req, res) => {
  const { title } = req.body;
  const id = req.params.listId;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title  and cannot be empty.",
      isSuccess: false,
    });
  }

  try {
    const list = await List.findOne({ where: { id } });

    if (!list) {
      return res
        .status(404)
        .json({ message: "List not found", isSuccess: false });
    }
    await List.update({ title }, { where: { id } });

    res.status(200).json({
      message: "List updated successfully",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
};

// Delete a list by ID
exports.deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const ListDoc = await List.findOne({ where: { id } });

    if (!ListDoc) {
      return res.status(404).json({
        message: "List not found",
        isSuccess: false,
      });
    }
    await List.destroy({ where: { id } });
    return res.status(200).json({
      message: "List deleted successfully",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch the title of an old list by ID
exports.getOldListTitle = async (req, res) => {
  const id = req.params.listId;

  try {
    const list = await List.findByPk(id);
    if (!list) {
      return res
        .status(404)
        .json({ message: "List not found", isSuccess: false });
    }
    res.status(200).json({ isSuccess: true, title: list.title });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
