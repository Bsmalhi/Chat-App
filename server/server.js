const path =  require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT|| 3000;
var app = express();
var server = http.createServer(app); //now using http server
var io = socketIO(server); //Using web socket server 


io.on( 'connection' ,(socket)=>{
    console.log('New user is connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new User joined'));

    socket.on('createMessage', (Message, callback)=>{
        console.log('createMessage', Message);
        io.emit('newMessage', generateMessage(Message.from, Message.text,));
        callback('This is from the server');
        // socket.broadcast.emit('newMessage', {
        //     from: Message.from,
        //     text: Message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', ()=>{
            console.log('disconnected to server');
    });
});



app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(" Server is running on port: ", port);
});
