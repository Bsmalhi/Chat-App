var socket = io();
socket.on('connect', function(){
    console.log('connected to server');

});
socket.on('disconnect', function(){
    console.log('disconnected to server');
});

socket.on('newMessage', function(newMessage){
    console.log('NewMessage: ', newMessage);
    var li = $('<li></li>');
    li.text(`${newMessage.from}: ${newMessage.text}`);
    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

$('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: jQuery('[name="message"]').val()
    },function(){

    });
});

    var locationButton = $('#send-location');//making it resuable
    locationButton.on('click', function(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported in this browser');
        }
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position);
            socket.emit('createLocationMessage',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function(){
            alert('Unable to fetch location.');
        });
    });

