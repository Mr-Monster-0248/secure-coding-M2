const express = require('express');

const app = express();

const users = [
  { id: '1', username: 'thibault', password: 'qwerty' },
  { id: '2', username: 'ruben', password: 'azerty' },
];

function getUser(user, pass) {
  return users.find((u) => u.username === user && u.password === pass);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: __dirname });
});

app.post('/user', (req, res) => {
  const user = getUser(req.body.username, req.body.password);
  if (user) {
    res.redirect(`/user/${user.id}`);
  } else {
    res.statusCode = 403;
    res.send('Invalid username or mdp');
  }
});

app.get('/user/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  res.send(`
      <h1>Hello</h1>
      <ul>
        <li>id: ${user.id}</li>
        <li>username: ${user.username}</li>
      </ul>
      <a href="/logout">logout</a>
    `);
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Safe server started on http://localhost:8080');
});
