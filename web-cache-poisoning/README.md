# Web cache poisoning

## Principle

Web Cache Poisoning consist in using the caching feature of certain servers or DNS to spread malicious pages or code.
Some servers or DNS resolvers use caching, meaning that they will store the response of certain requests in memory for when other users use **the exact same** request, in order to improve server performance. The server will then respond with the request stored in its cache and wont need to compute an other response.

> ℹ️ More information on this vulnerability on the [portswigger website](https://portswigger.net/web-security/web-cache-poisoning)

## Use the vulnerability

The vulnerability consists in crafting a request that will make the server incorporate a malicious piece of code into the cached response. If your request headers end up being cached and reused for other responses you can imagine that the malicious code will be dispatched and executed on other clients.

## Our implementation of web cache poisoning

To demonstrate the vulnerability we decided to build a web server with some server-side caching.

> Note that the caching often happens on the DNS side, and is often set to true by default.

To do so, we use `express` and a library for memory caching. It is of course just a server for demonstration purposes and it does not represent a real-life usage of headers.

Here is the server-side caching code:

```js
const cache = (duration) => {
  return (req, res, next) => {
    const key = "__express__" + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.set("X-Cache", "hit");
      res.send(cachedBody);
      return;
    } else {
      res.set("X-Cache", "miss");
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};
```

This code takes the requested URL and makes it a `key`. This `key` is then associated to a response body. If an other user sends the exact same request to the server, then the server will send the recorded response directly.

Then, we specify to our server to cache the response for the `/` URL. (It is **_very_** unlikely for a real wesite).

```js
app.get("/", cache(60), (req, res) => {
  // We set an header that allow caching
  res.set("Cache-control", "public, max-age=300");

  // We use an header variable for any reason
  const host = req.header("X-Forwarded-Host");
  res.set("X-Forwarded-Host", host);

  res.send(`
      <h1>Super safe website</h1>
      <img src="${host}/CHc0B6gKHqUAAAAi/deadserver.gif" />
    `);
});
```

What this code does is read from the user-provided header to display some picture.

> ⚠️ This is very unsafe. Once again it is only for demonstration purposes.

When sending a normal (expected) request:

![normal request](./img/normal-req.png)

We get this response:

![normal response](./img/normal-res.png)

Now, let's try to change the request to instert malicious code. We can just do it by changing the value of the `X-Forwarded-Host` header to `a" /><script>alert(1)</script>`.

Giving us this request:

![poison request](./img/poison-req.png)

And then...

![poison response](./img/poison-res-poison.png)

We can see that the js code we sent in the header has been executed. We can even check the source code of the HTML page in the response:

![poison response source code](./img/poison-res-code.png)

We can see that the code is now in the response body.

Now, let's try to request the exact same URL, but with an other browser and a normal header:

![poisoned response with normal request](./img/poison-res-normal.png)

We observe that the server served the cached response - the one with the malicious code ! Now, every user accessing this same URL will be served the malicious response.

## How to prevent web cache poisoning

There is no real way to prevent web cache poisoning. One radical solution would be to **disable caching entirely**, but it is not very realistic.

Another way to prevent problematic web cache poisoning would be to use caching only on static pages. Meaning that if a page doesn't use request data and always responds the same body, no web cache poisonning is possible, or more precisely no veritably harmful poisoning is possible.
