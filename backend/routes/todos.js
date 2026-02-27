const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createTodo,
  getTodos,
  deleteTodo,
} = require("../controllers/todoController");

router.post("/", auth, createTodo);
router.get("/", auth, getTodos);
router.delete("/:id", auth, deleteTodo);

module.exports = router;