const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.post('/result', (req, res) => {
  res.send(`
    <h2>Unsafe search result :</h2>
    <br>
    <p>${req.body.search}</p>
  `)
});

const port = 3000;
app.listen(port, () => {
  console.log('XSS Unsafe - Starting to listen on port ' + port);
});
