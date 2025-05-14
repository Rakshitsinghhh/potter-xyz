import express from "express";
import cors from "cors";
import mysql from "mysql";
import jwt from "jsonwebtoken";

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

  const query = `SELECT * FROM users WHERE mobile = ? AND password = ?`;
  connection.query(query, [mobile, password], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res
        .status(500)
        .json({ message: "Error checking login credentials" });
    }

    if (results.length > 0) {
      const user = results[0];
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
    } else {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }
  });
});

app.post("/signup", (req, res) => {
  const { mobile, password, name } = req.body;

  const query = `INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)`;
  connection.query(query, [name, mobile, password], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ message: "unable to signup" });
    } else {
      const payload = {
        mobile: mobile,
        name: name,
      };

      const token = jwt.sign(payload, "shhhh");

      return res.status(200).json({
        message: "signup successful",
        token: token,
        user: payload,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
