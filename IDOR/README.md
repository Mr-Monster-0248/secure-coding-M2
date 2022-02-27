# IDOR (Insecure Direct Object Reference)

We made custom Node.js servers to showcase the IDOR vulnerability. The IDOR vulnerability consist in accessing data that should not be able to be accessible, by fetching directly the data from the URL with no verification.

## Running the app

The app uses the monorepo technology, therefore you can run both server form the single main `package.json` file at the root of this directory.

- run the **unsafe** application:

```shell
npm run start --workspace=unsafe
```

- run the **safe** application:

```shell
npm run start --workspace=safe
```

## The unsafe server

### Base of the server

The server serves a classic login page:

![login page](./img/index.png)

The database is represented as such:

| id  | username | password |
| :-: | -------- | -------- |
|  1  | thibault | qwerty   |
|  2  | ruben    | azerty   |

### Point of failure

Once the user logs in correctly with the correct username and password, they get redirected to this page:

![user 1 page](./img/user1-page.png)

We can see that the path here is `/user/[userid]`. Even without knowing what happened in the backend, we can imagine that some other user would be served the same page, but with just a different `userId` value.

However, if we try to access `/user/2`, this is what happens:

![user 2 page](./img/user2-page.png)

**Banco ! We now have access to another user's data which we should not have access to.**

## The safe sever

### How to improve security ?

There are two main ways to increase the security of the app and avoid the IDOR vulnerability:

- The `id` (or any resource identifier) should be a non-predictable number or string because:
  - using sequential integers can be very predictable,
  - using strings that are too "transparent" (like `admin` or `private`) can lead to an IDOR vulnerability.
- The second and most important way to prevent the IDOR vulnerability is to **secure those routes**, using either sessions or cookies for example, or any other means of authentication.

### Our improvement

For our solution, we used sessions as a way to make sure the users are authenticated. We also changed the resource identifiers (the user IDs) to random strings.

The database now looks like this:

|      id      | username | password |
| :----------: | -------- | -------- |
| ASDFrfeqrQre | thibault | qwerty   |
| asQWefASdFRq | ruben    | azerty   |

Using sessions, we now have this:

```javascript
app.get('/', (req, res) => {
  const session = req.session;
  if (session.userid) {
    res.redirect(`/user/${session.userid}`);
  } else res.sendFile('views/index.html', { root: __dirname });
});
```

Here, for the `/` path, we see that if the session has already been set, the user automatically gets redirected to their own page.

After updating the `/user/:id` route handler, it now looks like this:

```javascript
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
```

What happens here is we check whether the user session matches the user data they are trying to reach. If it doesn't, we simply redirect them to `/`.

For example: if the user with the ID `ASDFrfeqrQre` tries to reach the resource `/user/asQWefASdFRq`, they will be redirected to `/user/ASDFrfeqrQre`.

![redirection](./img/network-changes.png)

**Re-banco ! The data is now safe.**
