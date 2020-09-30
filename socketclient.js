const net = require('net');
const port = 7070;
const host = '127.0.0.1';

// const client = new net.Socket();
// client.connect(port, host, function() {
//     console.log('Connected');
//     client.write("Hello From Client " + client.address().address);
// });

const client = net.createConnection(port, host, function () {
     console.log('client connected'); 
     client.write('Hi i am client')    
});
client.on('data', function(data) {
    console.log('Server Says : ' + data.toString());
});
client.on('close', function() {
    console.log('Connection closed');
});
