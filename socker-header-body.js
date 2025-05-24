const net = require("net");
const zlib = require("zlib");
const server = net.createServer((socket) => {
    console.log('Connection established with client');

    socket.on("data", (data) => {
        const requestData = data.toString();
        const lines = requestData.split('\r\n');
        console.log('Request lines:', lines);

        // Parse request line
        const [method, path, protocol] = lines[0].split(' ');
        console.log(`Method: ${method}`);
        console.log(`Path: ${path}`);
        console.log(`Protocol: ${protocol}`);

        // Parse headers
        const headers = {};
        let i = 1;
        while (lines[i] && lines[i] !== '') {
            const [key, value] = lines[i].split(': ');
            headers[key.toLowerCase()] = value;
            i++;
        }
        console.log('Headers:', headers);

        // Parse body (if any)
        const bodyIndex = requestData.indexOf('\r\n\r\n');
        const body = requestData.slice(bodyIndex + 4);
        if (body) {
            console.log('Body:', body);
        }


        if (path === "/") {
            socket.write(
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                'Content-Length: 10\r\n' +
                '\r\n' +
                'Hello from server!'
            );
        } else if (path === "/user-agent") {
            const userAgent = headers['user-agent'];
            socket.write(
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${userAgent.length}\r\n` +
                '\r\n' +
                userAgent
            );
        }
        else if (method === 'POST' && path === "/create") {
            socket.write(
                'HTTP/1.1 201 Created\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                '\r\n' +
                body
            );
        }
        else if (method === 'POST' && path === "/gzip") {

            zlib.gzip(body, (err, compressed) => {
                if (err) {
                    console.error('Gzip compression error:', err);
                    socket.end();
                    return;
                }
                console.log('Compressed body length:', compressed);
                socket.write(
                    'HTTP/1.1 201 Created\r\n' +
                    'Content-Type: text/plain\r\n' +
                    `Content-Encoding: gzip\r\n` +
                    `Content-Length: ${compressed.length}\r\n` +
                    '\r\n'
                );
                socket.write(compressed);
            });
        }
        else if (path.startsWith("/echo")) {
            const echoMessage = path.split('/echo/')[1] || 'No message provided';
            const decodeMessage = decodeURIComponent(echoMessage);
            socket.write(
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${decodeMessage.length}\r\n` +
                '\r\n' +
                decodeMessage
            );
        }
        else {
            socket.write(
                'HTTP/1.1 404 Not Found\r\n' +
                'Content-Type: text/plain\r\n' +
                'Content-Length: 9\r\n' +
                '\r\n' +
                'Not Found'
            );
        }
         socket.end();

    });
    socket.on("close", () => {
        console.log('Client disconnected');
        socket.end();
    });
    socket.on("error", (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
