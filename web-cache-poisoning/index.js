const express = require('express');
const mcache = require('memory-cache');

const app = express();

// server-side caching
const cache = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.set('X-Cache', 'hit');
      res.send(cachedBody);
      return;
    } else {
      res.set('X-Cache', 'miss');
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

app.get('/', cache(60), (req, res) => {
  // We set an header that allow caching
  res.set('Cache-control', 'public, max-age=300');

  // We use an header variable for any reason
  const host = req.header('X-Forwarded-Host');
  res.set('X-Forwarded-Host', host);

  res.send(`
      <h1>Super safe website</h1>
      <img src="${host}/CHc0B6gKHqUAAAAi/deadserver.gif" />
    `);
});

app.listen(8080, () => {
  console.log('Safe server started on http://localhost:8080');
});
