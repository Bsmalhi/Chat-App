const path =  require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');
const {isString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT|| 3000; //Heroku setup or localhost

var app = express();
var server = http.createServer(app); //now using http server
var io = socketIO(server); //Using web socket server 
var users = new Users();

app.use(express.static(publicPath));

io.on( 'connection' ,(socket)=>{
    console.log('New user is connected');

    
    socket.on('join', (params, callback)=>{
        if(!isString(params.name) || !isString(params.room)){
            callback('Name and rooms are needed');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));


        callback();
    });

    socket.on('createMessage', (Message, callback)=>{
        console.log('createMessage', Message);
        io.emit('newMessage', generateMessage(Message.from, Message.text,));
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});


server.listen(port, ()=>{
    console.log(" Server is running on port: ", port);
});
