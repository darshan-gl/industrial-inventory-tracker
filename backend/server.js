const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Spam@123",
  database: "inventory_db"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL Connected");
});

// GET all equipment
app.get("/api/equipment", (req, res) => {
  db.query("SELECT * FROM equipment", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD equipment
app.post("/api/equipment", (req, res) => {
  const { name, type, status, date } = req.body;
  const id = uuid();

  db.query(
    "INSERT INTO equipment VALUES (?,?,?,?,?)",
    [id, name, type, status, date],
    err => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Equipment added" });
    }
  );
});

// UPDATE equipment
app.put("/api/equipment/:id", (req, res) => {
  const { name, type, status, date } = req.body;

  db.query(
    "UPDATE equipment SET name=?, type=?, status=?, date=? WHERE id=?",
    [name, type, status, date, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Equipment updated" });
    }
  );
});

// DELETE equipment
app.delete("/api/equipment/:id", (req, res) => {
  db.query(
    "DELETE FROM equipment WHERE id=?",
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Equipment deleted" });
    }
  );
});

app.listen(5000, () =>
  console.log("Backend running on port 5000")
);
