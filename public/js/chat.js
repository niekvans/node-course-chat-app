var socket = io();


function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
        removeDot();
    }
    else {
        addDot();
    }

    if (document.hidden) {
        addDot();
    }
};

function removeDot() {
    console.log('removing dot');
    jQuery('#favicon').attr('href', '/images/chat.png');
};

function addDot() {
    console.log('adding dot');
    jQuery('#favicon').attr('href', '/images/chat_dot.png');
};

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        }
        else {
            window.history.replaceState({}, "page", "chat.html");
        }
    });

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
    window.location.href = '/';
});

socket.on('updateUserList', function (users) {
    var html = jQuery('<ul></ul>');
    users.forEach(function (user) {
        html.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(html);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        createdAt: formattedTime,
        from: message.from
    });

    jQuery('#messages').append(html);
    if(message.text !== 'Welcome to the chat app'){
        scrollToBottom();
    }
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        createdAt: formattedTime,
        from: message.from,
        latitude: message.latitude,
        longitude: message.longitude
    });

    jQuery('#messages').append(html);
    scrollToBottom();

});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by the browser');
    };

    locationButton.attr('disabled', 'disabled').text('Sending location....');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            lattitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });

});