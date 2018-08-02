var socket = io();

socket.on('connect', function () {
    socket.emit('newUserMainPage', {})
});

socket.on('newRoomList', function (rooms) {
    var html = jQuery('<select name="roomSelector"></select>');
    html.append(jQuery('<option></option>'));
    rooms.forEach(function (room) {
        html.append(jQuery('<option></option>').text(room));
    });

    jQuery('#room-selector').html(html);
});