const express = require("express"); // web server dependency 
const mysql = require("mysql2"); // mySQL dependency 
const fs = require('fs'); // file sync for pem file
require("dotenv").config(); // for .env setup where we define DB credetials etc

const app = express(); // spin up web service
const port = 3000;

const cors = require('cors');
app.use(cors({
  origin: [
    'https://web-app-zmqy.onrender.com',   // web app also hosted on Render
  ]
}));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync('./ca.pem')
  }
});

// wrap db function in the promise API for later useage in randomiser than needs to wait
const dbp = db.promise();

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
  const { id, title, year, director, poster } = req.query;

  if (!id && !title && !year && !director) {
    return res.status(400).json({
      error: "You must provide at least one of: id, title, director or year"
    });
  }

  let query = `
    SELECT t.*, d.director
    FROM titles t
    LEFT JOIN directors d ON t.id = d.id
    WHERE 1=1
  `;
  const values = [];

  if (id) { 
    query += " AND t.id = ?";
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

   if (poster) {
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


app.get('/randomise', async (req, res) => {
  try {
    const { years, ids, directors } = req.query;
    const responsePayload = {};

    // 1) Random years: /randomise?years=3
    if (years) {
      const n = parseInt(years, 10);
      if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: '`years` must be a positive integer' });
      }
      const [yearRows] = await dbp.query(
        `SELECT DISTINCT year
         FROM titles
         ORDER BY RAND()
         LIMIT ?`, [n]
      );
      responsePayload.years = yearRows.map(r => r.year);
    }


    // 2) Random IDs: /randomise?ids=3
    if (ids) {
      const n = parseInt(ids, 10);
      if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: '`ids` must be a positive integer' });
      }
      const [idRows] = await dbp.query(
        `SELECT DISTINCT id
         FROM titles
         ORDER BY RAND()
         LIMIT ?`, [n]
      );
      responsePayload.ids = idRows.map(r => r.id);
    }

    // If no known query params were provided…
    if (Object.keys(responsePayload).length === 0) {
      return res.status(400).json({
        error: 'Please provide at least one of: years, ids (e.g. ?years=3 or ?ids=5)'
      });
    }

    res.json(responsePayload);

  } catch (err) {
    console.error('[/randomise] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
