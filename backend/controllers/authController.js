const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "User already exists" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (user.rows.length === 0)
    return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!validPassword)
    return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET
  );

  res.json({ token });
};