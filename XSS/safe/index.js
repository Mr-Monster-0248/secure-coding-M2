const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

// Encode problematic characters to HTML code
function sanitize (string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

app.post('/result', (req, res) => {
  // Safer input recuperation - HTML code sanitization
  const displayResult = sanitize(req.body.search);

  res.send(`
    <h2>Unsafe search result :</h2>
    <br>
    <p>${displayResult}</p>
  `)
});

const port = 3000;
app.listen(port, () => {
  console.log('XSS Safe - Starting to listen on port ' + port);
});
