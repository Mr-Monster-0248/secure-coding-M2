const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { db } = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.use(session({
  name: 'sessionId',
  resave: true,
  secret: 'super_secret_secret',
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true
  }
}));

db.init();


app.get('/', (req, res) => {
  const session = req.session;

  if (session.userid) {
    res.redirect(`/user/${session.userid}`);
  } else {
    res.sendFile('views/index.html', { root: __dirname });
  }
});

app.post('/login', (req, res) => {
  const session = req.session;
  if (session.userId) {
    res.redirect(`/user/${session.userId}`);
  }

  const user = db.getUserByUsername(req.body.username);

  if (user) {
    if (user.password === req.body.password) {
      session.userId = user.id;
      res.redirect(`/user/${user.id}`);
    } else {
      res
        .status(403)
        .send(`
          <h1>Invalid password</h1>
          <a href="/">Go back</a>
        `);
    }
  } else {
    res
      .status(404)
      .send(`
        <h1>User doesn't exist</h1>
        <a href="/">Go back</a>
      `);
  }
});

app.get('/user/:id', (req, res) => {
  const session = req.session;

  if (session.userId) {
    const user = db.getUserById(req.params.id);

    if (user) {
      res.send(`
        <h1>Hello ${user.username}!</h1>
        <h2>Wallah bro your data is super safe with us</h2>

        <a
          href="http://localhost:3000/malicious-link?userId=${user.id}"
          target="_blank"
        >Come here, look at this other super safe website</a>
        
        <form action="/delete_account" method="POST">
          <input type="hidden" name="userId" value="${user.id}" />
          <input type="submit" value="Delete account" />
        </form>
        <a href="/logout">Logout</a>
      `);
    } else {
      res
        .status(404)
        .send(`
          <h1>Account doesn't exist, sorry !</h1>
          <a href="/">Home</a>
        `);
    }
  } else {
    res.redirect('/');
  }
});

app.post('/delete_account', (req, res) => {
  console.log('/delete_account # data:', req.body.userId);

  const session = req.session;

  if (session.userId) {
    if (session.userId === req.body.userId) {
      req.session.destroy();

      const deleted = db.deleteUser(req.body.userId);

      if (deleted) {
        res.send(`
          <h1>Account deleted !</h1>
          <a href="/">Home</a>
        `);
      } else {
        res
          .status(404)
          .send(`
            <h1>Account doesn't exist, sorry !</h1>
            <a href="/">Home</a>
          `);
      }
    }
  } else {
    res
      .status(401)
      .send(`
        <h1>You must be logged in</h1>
        <a href="/">Home</a>
      `);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


const port = 8080;
app.listen(port, () => {
  console.log('CSRF Unsafe - Started listening on port ' + port);
});
