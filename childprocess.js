const http = require('http');
const { fork } = require('child_process');

const server = http.createServer();
server.on('request', (req, res) => {
    if (req.url === '/compute') {
        const forked = fork('child.js');
        forked.send('start');
        forked.on('message', sum => {
            res.end(sum.toString());
            forked.kill('SIGKILL');

        })

    } else {
        res.end('OK');
    }
})
server.listen(9990);

// following code in child.js
const longcomputation = () => {
    let sum = 0;
    for (let i = 0; i < 10e9; i++) {
        sum += i;
    }
    return sum;
}

process.on('message', (msg) => {
    const sum = longcomputation();
    process.send(sum)
})
