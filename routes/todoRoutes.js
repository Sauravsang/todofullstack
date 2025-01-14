import express from "express";
import auth from "../middleware/authMiddleware.js"

import {
  createTodoController,
  updateTodoController,
  deleteTodoController,
  getAllTodosController,
} from "../controllers/todoController.js";

const router = express.Router();

router.post("/create", auth ,  createTodoController);
router.put("/update/:id", auth , updateTodoController);
router.delete("/delete/:id", auth , deleteTodoController);
router.get("/getAllTodos", auth ,getAllTodosController);

export default router;