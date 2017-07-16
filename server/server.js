const path =  require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT|| 3000;
var app = express();
var server = http.createServer(app); //now using http server
var io = socketIO(server); //Using web socket server 


io.on( 'connection' ,(socket)=>{
    console.log('New user is connected');

    socket.emit('newEmail', {
        from: 'mbm@text.com',
        text: 'Hey I sent you this',
        createdAt: 123
    });

    socket.emit('newMessage',{
        from: 'john',
        text: 'Seee yaa',
        createdAt: 123
    });

    socket.on('createMessage', (Message)=>{
        console.log('createMessage', Message);
    });
    
    socket.on('disconnect', ()=>{
            console.log('disconnected to server');
    });
});



app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(" Server is running on port: ", port);
});
