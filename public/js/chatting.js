var socket = io();

function scrollToBottom(){

    var message = $('#messages');
    var newMessage = message.children('li:last-child');
    var clientHeight = message.prop('clientHeight');
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newHeight +lastMessageHeight >= scrollHeight){
        message.scrollTop(scrollHeight);
    }
};

socket.on('connect', function(){
    // console.log('connected to server');
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if (err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    });
});
socket.on('disconnect', function(){
    console.log('disconnected to server');
});

socket.on('updateUserList', function(users){
    var ol = $('<ol></ol>');
    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
});

socket.on('newMessage', function(newMessage){
    var formattedTime = moment(newMessage.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text: newMessage.text,
        from: newMessage.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
    // var formattedTime = moment(newMessage.createdAt).format('h:mm a');
    // console.log('NewMessage: ', newMessage);
    // var li = $('<li></li>');
    // li.text(`${newMessage.from} (${formattedTime}): ${newMessage.text}`);
    // $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
});

$('#message-form').on('submit', function(e){
    e.preventDefault();

    var messageText = $('[name=message]')

    socket.emit('createMessage',{
        from: 'User',
        text: messageText.val()
    },function(){
        messageText.val('');
    });
});

    var locationButton = $('#send-location');//making it reusable
    locationButton.on('click', function(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported in this browser');
        }
        locationButton.attr('disabled', 'disabled').text('Sending location..');
        navigator.geolocation.getCurrentPosition(function(position){
            locationButton.removeAttr('disabled').text('Send location');
            console.log(position);
            socket.emit('createLocationMessage',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function(){
            locationButton.removeAttr('disabled').text('Send location');
            alert('Unable to fetch location.');
        });
    });

