const net = require('net');
const port = 7070;
const host = '127.0.0.1';

const socketclients=[];

const server = net.createServer();
server
.on('connection',(socket)=>{
    
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    socketclients.push(socket);

    socket.on('data', (data) => {
        console.log('client data:');
        socketclients.forEach(function(sock, index, array) {  // broadcast data to all connected clients
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
        console.log(data.toString());
    });
    socket.on('close', function(data) {  // this will trigger when client socket disconnected
        let index = socketclients.findIndex(function(o) {
            return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
        })
        if (index !== -1) socketclients.splice(index, 1);
        console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
    });
    socket.on('error', function(data) {  // this will trigger when client socket disconnected        
        console.log('ERROR: ' + socket.remoteAddress + ' ' + socket.remotePort);
    });
    socket.write('SERVER: Hello! This is server speaking.<br>');   
})
.on('error', (err) => {
    console.error(err);
});



server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

// const server = net.createServer((socket) => {    
//     socket.on('data', (data) => {
//         console.log(data.toString());
//     });
//     socket.write('SERVER: Hello! This is server speaking.<br>');   
// })
// .on('connection',(socket)=>{
//     console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
//     socketclients.push(socket);
// })
// .on('error', (err) => {
//     console.error(err);
// });
// server.listen(port, host, () => {
//     console.log('opened server on', server.address().port)
// });
