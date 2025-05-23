import express from "express";
import cors from "cors";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

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

    const token = jwt.sign(payload, "shhhh");

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
    // 1. Check if mobile exists
    const checkQuery = `SELECT * FROM users WHERE mobile = ?`;
    connection.query(checkQuery, [mobile], async (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Mobile number already exists" });
      }

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Insert new user
      const insertQuery = `INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)`;
      connection.query(insertQuery, [name, mobile, hashedPassword], (err, results) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Insert failed" });
        }
        // 4. Generate token
        const payload = { mobile, name };
        const token = jwt.sign(payload, "shhhh");

        return res.status(200).json({
          message: "Signup successful",
          token,
          user: payload,
        });
      });
    });
  } catch (err) {
    console.error("Hashing error:", err);
    return res.status(500).json({ message: "Error processing signup" });
  }
});


app.post("/logs", (req, res) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  const payload = jwt.decode(token);
  if (!payload || !payload.mobile) {
    return res.status(400).json({ message: "Invalid token or mobile not found" });
  }

  const mobile = payload.mobile;
  const action = req.body.action;

  console.log("Attempting log insert for mobile:", mobile, "IP:", ip, "Time:", new Date().toISOString());

  const insertQuery = `
    INSERT INTO logs (mobile, action, ip, time)
    SELECT ?, ?, ?, NOW()
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1 FROM logs
      WHERE mobile = ? AND action = ? AND ip = ?
        AND time >= NOW() - INTERVAL 2 SECOND
    );
  `;

  const params = [mobile, action, ip, mobile, action, ip];

  connection.query(insertQuery, params, (err, results) => {
    if (err) {
      console.error("Log insert error:", err);
      return res.status(500).json({ message: "Insert failed" });
    }

    if (results.affectedRows === 0) {
      // Duplicate log within 2 seconds
      return res.status(200).json({ message: "Duplicate log skipped (within 2 seconds)" });
    }

    res.status(200).json({ message: "Log inserted successfully" });
  });
});

function jwtv(req, res) {
  const token = req.body.token;
  const secret = "shhhh";

  if (!token) {
    return res.status(400).send({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const mobile = decoded.mobile;

    if (!mobile) {
      console.log("❌ No mobile in token");
      return res.status(400).send({ error: "Invalid token: no mobile" });
    }

    console.log("🔐 Token verified. Mobile:", mobile);

    const query = `SELECT * FROM users WHERE mobile = ?`;
    connection.query(query, [mobile], (err, results) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).send({ error: "DB error" });
      }

      console.log("📦 DB results:", results);

      if (results.length === 0) {
        console.log("🚫 User not found in DB");
        return res.status(401).send({ error: "User no longer exists" });
      }

      // ✅ All good
      console.log("✅ User found. Returning ok.");
      res.status(200).send("ok");
    });

  } catch (err) {
    console.error("❌ JWT verify failed:", err.message);
    res.status(401).send({ error: "Invalid or expired token" });
  }
}


app.post("/Main", jwtv);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
