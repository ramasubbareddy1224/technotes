const net = require('net');
const port = 7071;
const host = '127.0.0.1';

const server = net.createServer();
server
    .on('connection', (socket) => {

        console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
        socket.on('data', (data) => {
            console.log('client data:', data.toString());
            socket.write("HTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 11\n\nHello world");
        });
        socket.on('close', function (data) {  // this will trigger when client socket disconnected            
            console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
        });
        socket.on('error', function (data) {  // this will trigger when client socket disconnected        
            console.log('ERROR: ' + socket.remoteAddress + ' ' + socket.remotePort);
        });        
    })
    .on('error', (err) => {
        console.error(err);
    })
    .listen(port,host,()=>{
        console.log('TCP Server is running on port ' + port + '.');
    });



// another example
var http = require('http');

http.createServer(onReq).listen(7070);

function onReq(req, res){
  var socket = res.socket;

  socket.write([
    'HTTP/1.1 200 OK',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Encoding: UTF-8',
    'Accept-Ranges: bytes',
    'Connection: keep-alive',
  ].join('\n') + '\n\n');

  socket.write(`
    <h1> Example </h1>
  `);

  socket.end();
};
