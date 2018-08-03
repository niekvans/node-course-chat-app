const _ = require('lodash');

class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var indexToRemove = this.users.findIndex((elem) => {
            return elem.id === id;
        });
        var userToDelete = this.users[indexToRemove];
        if (userToDelete) {
            this.users.splice(indexToRemove, 1);
        }
        return userToDelete;
    }

    getUser(id) {
        var foundUser = this.users.find((user) => {
            return user.id === id;
        });
        return foundUser;
    }

    getUserList(room) {
        var foundUsers = this.users.filter((user) => {
            return user.room === room;
        });
        var namesArray = foundUsers.map((user) => {
            return user.name;
        });

        return namesArray;
    }

    getActiveRooms() {
        var roomArray = this.users.map((user) => {
            return user.room;
        });

        return _.uniq(roomArray);
    }
    
    getActiveRoomsLowerCase() {
        var roomArray = this.users.map((user) => {
            return user.room.toLowerCase();
        });

        return _.uniq(roomArray);
    }

}

module.exports = { Users };

