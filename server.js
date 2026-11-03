const http = require('http');
const fs = require('fs');

// Stops a message like <script> from running as HTML
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // Show messages (newest first) above the form
  if (url === '/' && method === 'GET') {
    let messages = [];
    if (fs.existsSync('message')) {
      messages = fs.readFileSync('message', 'utf8').split('\n').filter(Boolean);
    }

    const list = messages
      .reverse()
      .map((m) => `<p class="msg">${escapeHtml(m)}</p>`)
      .join('');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`
      <html>
        <head>
          <style>
            body { font-family: sans-serif; margin: 20px; }
            .card { width: 260px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,.2); padding: 4px 12px; }
            .msg { font-size: 13px; margin: 10px 0; }
          </style>
        </head>
        <body>
          ${list ? `<div class="card">${list}</div>` : ''}
          <form action="/message" method="POST">
            <input type="text" name="message" autofocus>
            <button type="submit">Send</button>
          </form>
        </body>
      </html>
    `);
  }

  // Save the new message, then redirect with 302
  if (url === '/message' && method === 'POST') {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      const message = new URLSearchParams(body).get('message');

      const done = () => {
        res.writeHead(302, { Location: '/' });
        res.end();
      };

      if (message && message.trim()) {
        fs.appendFile('message', message.trim() + '\n', done);
      } else {
        done();
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>Page Not Found</h1>');
});

server.listen(3000, () => console.log('Listening on http://localhost:3000'));