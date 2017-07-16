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

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (Message)=>{
        console.log('createMessage', Message);
        // io.emit('newMessage', {
        //     from: Message.from,
        //     text: Message.text,
        //     createdAt: new Date().getTime()
        // });
        socket.broadcast.emit('newMessage', {
            from: Message.from,
            text: Message.text,
            createdAt: new Date().getTime()
        });
    });
    
    socket.on('disconnect', ()=>{
            console.log('disconnected to server');
    });
});



app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(" Server is running on port: ", port);
});
