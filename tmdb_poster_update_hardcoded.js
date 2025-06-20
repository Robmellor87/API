
const axios = require('axios');
const mysql = require('mysql2');
const fs = require('fs');

// Hardcoded credentials and API key
const db = mysql.createConnection({
  host: 'mysql-aiven-imdb-imdb-data.i.aivencloud.com',
  port: 19586,
  user: 'avnadmin',
  password: 'AVNS_lpkI84M_uRh8fWzkvVn',
  database: 'defaultdb',
  ssl: { ca: fs.readFileSync('./ca.pem') }
});

const TMDB_API_KEY = '361cbfab9876e9a136159d1595a73637';

async function fetchPosterURL(title) {
  try {
    const res = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query: title
      }
    });
    const movie = res.data.results[0];
    if (movie && movie.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch poster for "${title}":`, err.message);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updatePosters() {
  db.query("SELECT id, title FROM titles WHERE posterURL IS NULL OR posterURL = ''", async (err, rows) => {
    if (err) throw err;

    for (const row of rows) {
      await sleep(100); // 300ms = ~3 requests/sec
      const posterURL = await fetchPosterURL(row.title);
      if (posterURL) {
        db.query(
          'UPDATE titles SET posterURL = ? WHERE id = ?',
          [posterURL, row.id],
          (err) => {
            if (err) {
              console.error(`Failed to update poster for "${row.title}":`, err.message);
            } else {
              console.log(`Updated poster for "${row.title}"`);
            }
          }
        );
      } else {
        fs.appendFileSync('missing_titles.txt', row.title + '\n');
      }
    }
  });
}

updatePosters();
