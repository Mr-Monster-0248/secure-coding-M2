const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`/views/index.html`, { root: __dirname });
})

app.get('/malicious-link', (req, res) => {
  console.log('/malicious-link # userId:', req.query.userId);
  res.redirect(`/?delete=${req.query.userId}`);
});


const port = 3000;
app.listen(port, () => {
  console.log('Malicious website - Started listening on port ' + port);
});
