import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "potter"
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit on failure
  }
  console.log("Connected to database");
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
  const { mobile, password } = req.body;

  const query = `SELECT * FROM users WHERE mobile = ? AND password = ?`;
  connection.query(query, [mobile, password], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ message: 'Error checking login credentials' });
    }

    if (results.length > 0) {
      // const user = results[0];
      return res.status(200).json({
        message: 'ok',
        // uniqueId: user.id || user.mobile // Assuming you have a unique `id`
      });
    } else {
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
