const cluster = require('cluster');
const os = require('os');
if (cluster.isMaster) {
    const cpus = os.cpus().length;
    console.log(`forking for ${cpus} cpus`)
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

} else {
    require('./server')
}

// following code in server.js file
const http = require('http');
const pid = process.pid;
const server = http.createServer();
server.on('request', (req, res) => {
    while(true);
  //  for (let i = 0; i < 1e7; i++);
    res.end(`handle process id ${pid}`);
})
server.listen(9990, () => {
    console.log(`started process ${pid}`)
});
