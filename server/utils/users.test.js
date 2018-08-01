const expect = require('expect');
var { Users } = require('./users');


describe('Testing users.js to store users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Niek',
            room: 'First Room'
        },
        {
            id: '2',
            name: 'Emma',
            room: 'Second Room'
        },
        {
            id: '3',
            name: 'Dude',
            room: 'First Room'
        }];
    });

    it('should create a new user', () => {
        var userList = new Users();
        var user = { id: 1, name: 'Niek', room: 'Room1' }
        var newUser = userList.addUser(user.id, user.name, user.room);
        expect(newUser).toMatchObject(user);

        expect(userList.users).toMatchObject([user]);
    });

    it('shoud remove a user from users', () => {
        var deletedUser = users.removeUser('2');
        expect(deletedUser).toMatchObject({ id: '2', name: 'Emma', room: 'Second Room' });
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user from users', () => {
        var deletedUser = users.removeUser('22342');
        expect(deletedUser).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should get user by id', () => {
        var foundUser = users.getUser('1');
        expect(foundUser).toMatchObject(users.users[0]);
    });

    it('should not return user by unknown id', () => {
        var foundUser = users.getUser('11021');
        expect(foundUser).toBeFalsy();
    });

    it('should find all users in First Room', () => {
        var foundUsers = users.getUserList('First Room');
        expect(foundUsers).toMatchObject(['Niek', 'Dude']);
    });

    it('should find all users in Second Room', () => {
        var foundUsers = users.getUserList('Second Room');
        expect(foundUsers).toMatchObject(['Emma']);
    });
});