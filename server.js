const http = require('http');

const server = http.createServer((req, res) => {
  let statusCode = 200;
  let message;

  switch (req.url) {
    case '/':
      message = 'Hello World';
      break;
    case '/pizza':
      message = 'This is your pizza';
      break;
    case '/home':
      message = 'Welcome home';
      break;
    case '/about':
      message = 'Welcome to About Us';
      break;
    case '/node':
      message = 'Welcome to my Node Js project';
      break;
    default:
      statusCode = 404;
      message = 'Page Not Found';
  }

  // Send the message wrapped in an HTML element
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(`<h1>${message}</h1>`);
});

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});