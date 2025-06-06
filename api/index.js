const express = require("express"); // web server dependency 
const mysql = require("mysql2"); // mySQL dependency 
require("dotenv").config(); // for .env setup where we define DB credetials etc

const app = express(); // spin up web service
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'yamanote.proxy.rlwy.net',
  port: 34252,
  user: 'root',
  password: 'JhrhtipykYGyIpNABYhkJNwqDgnItbJJ',
  database: 'railway'
});

// log err if mysql connection breaks
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('MySQL connected!');
  }
});

// GET route setup
app.get("/titles", (req, res) => {
  const { id, title, year, director } = req.query;

  if (!id && !title && !year && !director) {
    return res.status(400).json({
      error: "You must provide at least one of: id, title, director or year"
    });
  }

  let query = `
    SELECT t.*, d.director
    FROM titles t
    LEFT JOIN directors d ON t.title_id = d.title_id
    WHERE 1=1
  `;
  const values = [];

  if (id) {
    query += " AND t.title_id = ?";
    values.push(id);
  }

  if (title) {
    query += " AND t.title LIKE ?";
    values.push(`%${title}%`);
  }

  if (year) {
    query += " AND t.year = ?";
    values.push(year);
  }

  if (director) {
    query += " AND d.director = ?";
    values.push(director);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});


/** POST route setup

app.use(express.json());  // Needed to parse JSON POST bodies

app.post("/titles/director", (req, res) => {
  const { id, director } = req.body;

  if (!id || !director) {
    return res.status(400).json({ error: "Both 'id' and 'director' are required." });
  }

  const query = "UPDATE titles SET director = ? WHERE id = ?";
  const values = [director, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No title found with that id." });
    }

    res.json({ message: "Lead actor updated successfully." });
  });
}); // end of POST route **/



// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
