const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { db } = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Setting up session cookies
app.use(session({
  name: 'sessionId',
  resave: true,
  secret: 'super_secret_secret',
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: false
  }
}));

// Initializing users DB
db.init();

// GET /
app.get('/', (req, res) => {
  const session = req.session;

  if (session.userid) {
    res.redirect(`/user/${session.userid}`);
  } else {
    res.send(`
      <h1>Home</h1>

      <h2>Login</h2>
      <form action="http://localhost:8080/login" method="POST">
        <div class="input-field">
          <input type="text" name="username" id="username" placeholder="Enter Username" />
        </div>
        <div class="input-field">
          <input type="password" name="password" id="password" placeholder="Enter Password" />
        </div>
        <input type="submit" value="Login" />
      </form>
    `);
  }
});

// POST /login
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

// GET /user/:id
app.get('/user/:id', (req, res) => {
  const session = req.session;

  if (session.userId) {
    const user = db.getUserById(req.params.id);

    if (user) {
      res.send(`
        <h1>Hello ${user.username}!</h1>
        <h2>I swear bro your data is super safe with us</h2>

        <a
          href="http://localhost:3000/malicious-link?userId=${user.id}"
          target="_blank"
        >Come here, look at this other super safe website</a>
        
        <form action="/delete_account" method="POST">
          <input type="hidden" name="userId" value="${user.id}" />
          <input type="submit" value="Delete account" />
        </form>
        
        <form action="/logout" method="POST">
          <input type="submit" value="Logout" />
        </form>
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
    res
      .status(403)
      .send(`
        <h1>You must be logged in to see this</h1>
        <a href="/">Home</a>
      `);
  }
});

// POST /delete_account
app.post('/delete_account', (req, res) => {
  console.log('/delete_account # data:', req.body.userId);

  const session = req.session;

  if (session.userId) {
    if (session.userId === req.body.userId) {
      // Delete user session
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
        <h1>You must be logged in to see this</h1>
        <a href="/">Home</a>
      `);
  }
});

// POST /logout
app.post('/logout', (req, res) => {
  const session = req.session;

  if (session.userId) {
    // Delete user session
    req.session.destroy();
    res.redirect('/');
  } else {
    res
      .status(403)
      .send(`
        <h1>You must be logged in to see this</h1>
        <a href="/">Home</a>
      `);
  }
});


const port = 8080;
app.listen(port, () => {
  console.log('CSRF Unsafe - Started listening on port ' + port);
});
