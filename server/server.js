const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');
var userList = new Users();

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('newUserMainPage', () => {
        var roomList = userList.getActiveRooms();
        socket.emit('newRoomList', roomList);
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || (!isRealString(params.room) && !isRealString(params.roomSelector))) {
            return callback('Name and room are required');
        }
        if (params.room && params.roomSelector) {
            return callback('Please choose between starting a new room or joining a room.');
        }
        if (userList.getActiveRooms().indexOf(params.room) >= 0) {
            return callback(`Room ${params.room} already exists.`);
        }
        params.room = params.room || params.roomSelector;
        if (userList.getUserList(params.room).indexOf(params.name) >= 0) {
            return callback(`The name ${params.name} was already chosen by someone else.`)
        }

        socket.join(params.room);
        userList.removeUser(socket.id);
        userList.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', userList.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = userList.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = userList.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lattitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var goneUser = userList.removeUser(socket.id);
        if (goneUser) {
            io.to(goneUser.room).emit('updateUserList', userList.getUserList(goneUser.room));
            io.to(goneUser.room).emit('newMessage', generateMessage('Admin', `${goneUser.name} left the room.`));
        }
    });

});

server.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});

