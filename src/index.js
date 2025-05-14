import express from "express";
import cors from "cors";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const saltRounds=10;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "potter",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});


app.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  const query = `SELECT * FROM users WHERE mobile = ?`;
  connection.query(query, [mobile], async (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res
        .status(500)
        .json({ message: "Error checking login credentials" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const user = results[0];

    // ✅ Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const payload = {
      mobile: user.mobile,
      name: user.name,
    };

    const token = jwt.sign(payload, "shhhh", { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: payload,
    });
  });
});


app.post("/signup", async (req, res) => {
  const { mobile, password, name } = req.body;

  try {
    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert into DB
    const query = `INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)`;
    connection.query(query, [name, mobile, hashedPassword], (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ message: "Unable to signup" });
      }

      // 3. JWT payload
      const payload = { mobile, name };
      const token = jwt.sign(payload, "shhhh", { expiresIn: "1h" });

      // 4. Send response
      return res.status(200).json({
        message: "Signup successful",
        token,
        user: payload,
      });
    });
  } catch (err) {
    console.error("Hashing error:", err);
    return res.status(500).json({ message: "Error processing signup" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
