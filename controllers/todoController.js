import Todo from "../models/todoSchema.js";

export async function createTodoController(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      return res
        .status(200)
        .json({ message: "Please provide a title and description" });
    }

    await Todo({ title, description, userId }).save();

    return res.status(200).json({
      success: true,
      message: "Todo created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create todo",
    });
  }
}

export async function updateTodoController(req, res) {
  try {
    const todoId = req.params.id;

    if (!todoId) {
      return res.status(400).json({ message: "Please provide a todo ID" });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please provide a title or description" });
    }
    // Find then update the todo list with the current todo list
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      updatedTodo,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update todo",
    });
  }
}

export async function deleteTodoController(req, res) {
  try {
    const todoId = req.params.id;
    if (!todoId) {
      return res.status(400).json({ message: "Please provide a todo ID" });
    }
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
}

export async function getAllTodosController(req, res) {
  try {
    const id = req.userId;
    const todos = await Todo.find({userId: id});
    if (!todos) {
      return res.status(200).json({
        success: false,
        message: "No todos found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Todos fetched successfully", todos });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `ailed to fetch todos ${error.message}`,
    });
  }
}
