var io = require('socket.io')({
    transports: ['websocket','xhr-polling']
});
var config = require('../config.json');
var chatsCollection = config.COLLECTIONS.CHATS;
var mongoUtils = require('./utils/mongo');
var debug = require('debug')('server/socketio');
var ROLES = config.ROLES;
var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) { return ROLES[key]; }).reverse();

var defaultRoom = 'general';
var peopleOnline = [];
var rooms = [];
rooms[defaultRoom] = [];

io.on("connection", function (socket) {

    debug("A user connected");
    socket.join(defaultRoom);
//    socket.leave(socket.id); //Leave socket.io default room

    function removeUserFromRooms(name) {
        for(var room in rooms) {
            var index = rooms[room].indexOf(name);

            if(index > -1)
                rooms[room].splice(index, 1);
        }
    }

    /**********************/
    /***** Connection *****/
    /**********************/
    socket.on('disconnect', function () {
        if(peopleOnline[socket.id]) {
            var username = peopleOnline[socket.id].name;
            debug(username + ' disconnected');
            removeUserFromRooms(username);
            delete peopleOnline[socket.id];
            // debug('peopleOnline', peopleOnline);
            // debug('rooms', rooms);

        } else {
             debug("A user disconnected");
        }
    });


    socket.on('logged-in', function(user) {
        peopleOnline[socket.id] = user;
        rooms[defaultRoom].push(user.name);
        debug(user.name + ' Logged in');
        // debug('peopleOnline', peopleOnline);
        // debug('rooms', rooms);

        socket.join('notifications-' + user.role); //Join notification-role room.
        socket.emit('online-users', {room: defaultRoom, users: rooms[defaultRoom]});
        io.emit('notification', {message: user.name + ' Logged In', timestamp: new Date().toDateString()}); //FIXME Notification Testing
    });

    /*************************/
    /***** Notifications *****/
    /*************************/

    //Notification to specific user - identified by email.
    socket.on('notification-user', function(userEmail) {

        var userSockId;
        for(var sockId in peopleOnline) {
            if(peopleOnline[sockId].email === userEmail)
                userSockId = sockId;
        }
        if(!userSockId) {
            debug('ERROR: notification-user - could\'nt find ' + userEmail);
            return;
        }

        io.sockets.to(userSockId).emit('notification', { message: peopleOnline[socket.id].name + ' poked you!', timestamp: new Date().toDateString() }); //FIXME change timestamp format
    });


    //Notification to all users of specified role and higher.
    socket.on('notification-role', function(role, message) {

        var index = ROLES_HIERARCHY.indexOf(role);
        if(index < 0) {
            debug('ERROR: notification-role - invalid role');
            return;
        }

        for(var i = index; i < ROLES_HIERARCHY.length; i++) {
            socket.broadcast.to('notification-' + ROLES_HIERARCHY[i]).emit('notification', message);
        }
    });

    /*************************/
    /***** Chat Messages *****/
    /*************************/
    socket.on('message', function(data) {
        var room = data.room;
        var message = data.message;

        if(room && room !== '') {
            socket.broadcast.to(room).emit('message', message);
        } else {
            socket.broadcast.to(defaultRoom).emit('message', message);
        }

        //Saving message to chat history
        mongoUtils.update(chatsCollection,
                         {_id: room},
                         {$push: {"messages": message}}, 
                         {upsert: true}, 
                         function(error, result) {
                            debug('update chat', JSON.stringify(result));
        });
        
    });

    /*****************/
    /***** Rooms *****/
    /*****************/
    socket.on('room.join', function(room) {
        if(!room) {
            debug('ERROR: room.join - room is undefined');
        }

        if(!rooms[room])
            rooms[room] = [];

        rooms[room].push(peopleOnline[socket.id].name);
        socket.join(room);
        socket.emit('online-users', {room: room, users: rooms[room]});
        debug(peopleOnline[socket.id].name + ' joined', room);
    });

    socket.on('room.leave', function(room) {
        if(!room) {
            debug('ERROR: room.leave - room is undefined');
        }

        rooms[room].splice(rooms[room].indexOf(peopleOnline[socket.id].name), 1);
        socket.leave(room);
        socket.emit('online-users', {room: room, users: rooms[room]});
        debug(peopleOnline[socket.id].name + ' left', room);
    });

});

module.exports = io;
