var socket = io();
socket.on('connect', function(){
    console.log('connected to server');

   socket.emit('createMessage', {
       from: 'Baljot',
       text: 'Whadsss up!'
   });
});
socket.on('disconnect', function(){
    console.log('disconnected to server');
});

socket.on('newMessage', function(newMessage){
    console.log('NewMessage: ', newMessage);
});

