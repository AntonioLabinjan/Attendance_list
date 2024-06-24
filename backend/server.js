const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
  db.run("CREATE TABLE students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, jmbag TEXT UNIQUE)");
});

app.get('/students', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.post('/students', (req, res) => {
  const { name, surname, jmbag } = req.body;
  if (!/^\d{10}$/.test(jmbag)) {
    res.status(400).json({ error: 'JMBAG must be exactly 10 digits long' });
    return;
  }
  db.run(`INSERT INTO students (name, surname, jmbag) VALUES (?, ?, ?)`, [name, surname, jmbag], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'JMBAG must be unique' });
      } else {
        res.status(400).json({ error: err.message });
      }
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.put('/students/:id', (req, res) => {
  const { name, surname, jmbag } = req.body;
  if (!/^\d{10}$/.test(jmbag)) {
    res.status(400).json({ error: 'JMBAG must be exactly 10 digits long' });
    return;
  }
  db.run(
    `UPDATE students SET name = ?, surname = ?, jmbag = ? WHERE id = ?`,
    [name, surname, jmbag, req.params.id],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'JMBAG must be unique' });
        } else {
          res.status(400).json({ error: err.message });
        }
        return;
      }
      res.json({ updatedID: this.changes });
    }
  );
});

app.delete('/students/:id', (req, res) => {
  db.run(`DELETE FROM students WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: this.changes });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
