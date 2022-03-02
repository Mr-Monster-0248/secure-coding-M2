const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// Encode problematic characters to HTML code
function sanitize (string) {
  return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.post('/result', (req, res) => {
  res.send(`
    <h2>Unsafe search result :</h2>
    <br>
    <p>${sanitize(req.body.search)}</p>
  `)
});

const port = 3000;
app.listen(port, () => {
  console.log('XSS Safe - Starting to listen on port ' + port);
});
