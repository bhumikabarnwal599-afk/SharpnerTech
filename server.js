const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'message');

// Create the file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
}

// Function to prevent HTML injection
function escapeHTML(text) {
    return text.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

const server = http.createServer((req, res) => {

    // TASK 2: Read messages and display the form
    if (req.method === 'GET' && req.url === '/') {

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                return res.end('Unable to read messages');
            }

            // Get all messages and show newest first
            const messages = data
                .split('\n')
                .filter(message => message.trim() !== '')
                .reverse();

            const messageList = messages.map(message =>
                `<li>${escapeHTML(message)}</li>`
            ).join('');

            // HTML form and previous messages
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Message Board</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background: #f4f4f4;
                            padding: 30px;
                        }

                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: white;
                            padding: 25px;
                            border-radius: 10px;
                        }

                        input {
                            width: 95%;
                            padding: 12px;
                            margin: 10px 0;
                        }

                        button {
                            padding: 12px 25px;
                            background: #2563eb;
                            color: white;
                            border: none;
                            cursor: pointer;
                        }

                        li {
                            background: #eee;
                            padding: 12px;
                            margin: 8px 0;
                            list-style: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>

                <body>
                    <div class="container">

                        <h1>Message Board</h1>

                        <h2>All Messages</h2>

                        <ul>
                            ${messageList || '<li>No messages yet!</li>'}
                        </ul>

                        <h2>Add a New Message</h2>

                        <form action="/message" method="POST">
                            <input
                                type="text"
                                name="message"
                                placeholder="Enter your message"
                                required
                            >

                            <button type="submit">
                                Send Message
                            </button>
                        </form>

                    </div>
                </body>
                </html>
            `;

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(html);
        });
    }

    // TASK 1 + TASK 2: Receive and save submitted message
    else if (req.method === 'POST' && req.url === '/message') {

        const chunks = [];

        // Receive data in chunks
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        // When all data is received
        req.on('end', () => {

            // Convert Buffer into string
            const body = Buffer.concat(chunks).toString();

            // Extract message from form data
            const params = new URLSearchParams(body);
            const userMessage = params.get('message')?.trim();

            if (!userMessage) {
                res.writeHead(400, {
                    'Content-Type': 'text/plain'
                });
                return res.end('Message cannot be empty');
            }

            // Append message to the file
            fs.appendFile(filePath, userMessage + '\n', (err) => {

                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    return res.end('Unable to save message');
                }

                // Redirect with HTTP 302
                res.writeHead(302, {
                    'Location': '/'
                });

                res.end();
            });
        });
    }

    // Handle unknown URLs
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Page Not Found</h1>');
    }

});

// Start server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});