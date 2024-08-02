const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;


// Middleware
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE data (key TEXT, value TEXT)");
});

// GET endpoint
app.get('/get', (req, res) => {
  db.all("SELECT * FROM data", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.post('/post', (req, res) => {
    console.log(req.body); // Log the incoming data
    const { key, value } = req.body;
    db.run("INSERT INTO data (key, value) VALUES (?, ?)", [key, value], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Data added successfully!" });
    });
  });
  

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
