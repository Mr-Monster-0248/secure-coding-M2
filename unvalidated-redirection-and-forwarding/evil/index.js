const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.get('/mail', (req, res) => {
  res.sendFile('views/mail.html', { root: __dirname });
});

app.listen(6660, () => {
  console.log('Evil server started on http://localhost:6660');
});
