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
