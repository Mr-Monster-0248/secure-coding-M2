const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./database');
const { sql } = require('@databases/sqlite');

const app = express()
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', async (req, res) => {
  // Retrieving the request data
  const data = req.body;

  // Constructing the SQL query to run
  const safeQuery = sql`SELECT * FROM users WHERE (id = ${data.id});`;
  // Equivalent to => { text: 'SELECT * FROM users WHERE (id = $1)', values: [data.id] };

  // Running the SQL query
  const result = await db.query(safeQuery);

  // If the query retrieved some data,
  return result.length > 0
    ? res.status(200).json({ data: result }) // Sending back the data in teh response
    : res.status(404).json({ message: "User not found." }); // Else,
});

app.listen(port, () => {
  console.log(`SQL Injection (Safe) - Listening on port ${port}`);
});

app.use((req, res) => {
  res.status(404);
});
