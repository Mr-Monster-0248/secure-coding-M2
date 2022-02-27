const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

app.listen(8080, () => {
  console.log('Trust server started on http://localhost:8080');
});
