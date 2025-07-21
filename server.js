const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inițializează baza de date
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) return console.error("Eroare DB:", err.message);
  console.log("Baza de date creată sau deschisă cu succes.");
});

// Creează tabela useri (o singură dată)
db.run(`
  CREATE TABLE IF NOT EXISTS useri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    parola TEXT NOT NULL
  )
`);

// Înregistrare
app.post("/register", (req, res) => {
  const { username, parola } = req.body;
  db.run("INSERT INTO useri (username, parola) VALUES (?, ?)", [username, parola], function(err) {
    if (err) return res.status(400).json({ mesaj: "Utilizator existent sau eroare DB." });
    res.json({ mesaj: "Înregistrare reușită." });
  });
});

// Autentificare
app.post("/login", (req, res) => {
  const { username, parola } = req.body;
  db.get("SELECT * FROM useri WHERE username = ? AND parola = ?", [username, parola], (err, row) => {
    if (err) return res.status(500).json({ mesaj: "Eroare server." });
    if (!row) return res.status(401).json({ mesaj: "Date incorecte." });
    res.json({ mesaj: "Autentificat cu succes!" });
  });
});

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
});
