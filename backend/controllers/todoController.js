const pool = require("../db");

exports.createTodo = async (req, res) => {
  try {
    const { title, priority } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todos (title, priority, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, priority, req.user.id]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodos = async (req, res) => {
  const todos = await pool.query(
    "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );

  res.json(todos.rows);
};

exports.deleteTodo = async (req, res) => {
  await pool.query("DELETE FROM todos WHERE id = $1", [
    req.params.id,
  ]);
  res.json({ message: "Deleted" });
};