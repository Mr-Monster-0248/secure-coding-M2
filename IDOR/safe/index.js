const express = require('express');
const session = require('express-session');

const app = express();

const users = [
  { id: 'ASDFrfeqrQre', username: 'thibault', password: 'qwerty' },
  { id: 'asQWefASdFRq', username: 'ruben', password: 'azerty' },
];

function getUser(user, pass) {
  return users.find((u) => u.username === user && u.password === pass);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(
  session({
    name: 'sid',
    resave: true,
    secret: 'secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
    },
  })
);

app.get('/', (req, res) => {
  const session = req.session;
  if (session.userid) {
    res.redirect(`/user/${session.userid}`);
  } else res.sendFile('views/index.html', { root: __dirname });
});

app.post('/user', (req, res) => {
  const session = req.session;
  if (session.userid) {
    res.redirect(`/user/${session.userid}`);
  }
  const user = getUser(req.body.username, req.body.password);
  if (user) {
    session.userid = user.id;
    res.redirect(`/user/${user.id}`);
  } else {
    res.statusCode = 403;
    res.send('Invalid username or mdp');
  }
});

app.get('/user/:id', (req, res) => {
  const session = req.session;
  if (session.userid === req.params.id) {
    const user = users.find((u) => u.id === session.userid);
    res.send(`
      <h1>Hello</h1>
      <ul>
        <li>id: ${user.id}</li>
        <li>username: ${user.username}</li>
      </ul>
      <a href="/logout">logout</a>
    `);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Safe server started on http://localhost:8080');
});
