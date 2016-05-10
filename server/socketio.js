var io = require('socket.io')({
    transports: ['websocket','xhr-polling']
});
var config = require('../config.json');
var chatsCollection = config.COLLECTIONS.CHATS;
var mongoUtils = require('./utils/mongo');
var debug = require('debug')('server/socketio');
var ROLES = config.ROLES;
var ROLES_HIERARCHY = Object.keys(ROLES).map(function (key) { return ROLES[key]; }).reverse();

var people = [];

io.on("connection", function (socket) {

    debug("A user connected");
    var defaultRoom = 'general';
    socket.join(defaultRoom); 
//    socket.leave(socket.id); //Leave socket.io default room


    /**********************/
    /***** Connection *****/
    /**********************/
    socket.on('disconnect', function () {
        if(people[socket.id]) {
            debug(people[socket.id].name + ' disconnected');
            delete people[socket.id];

        } else {
             debug("A user disconnected");
        }
    });

    socket.on('client-disconnect', function() {
        socket.disconnect();
    });


    socket.on('logged-in', function(userData) {
        people[socket.id] = userData;
        debug(userData.name + ' Logged in');

        socket.join('notifications-' + userData.role);
        io.emit('notification', {message: userData.name + ' Logged In', timestamp: new Date().toDateString()}); //FUTURE Notification Testing
    });

    /*************************/
    /***** Notifications *****/
    /*************************/

    //Notification to specific user - identified by email.
    socket.on('notification-user', function(userEmail) {

        var userSockId;
        for(var sockId in people) {
            if(people[sockId].email === userEmail)
                userSockId = sockId;
        }
        if(!userSockId) {
            debug('ERROR: notification-user - could\'nt find ' + userEmail);
            return;
        }

        io.sockets.to(userSockId).emit('notification', { message: people[socket.id].name + ' poked you!', timestamp: new Date().toDateString() }); //FIXME change timestamp format
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
    socket.on('message', function(message, room) {

        if(room && room !== '') {
            socket.broadcast.to(room).emit('message', message);
        } else {
            socket.broadcast.to(defaultRoom).emit('message', message);
        }

        //Saving message to chat history
        mongoUtils.update(chatsCollection,
                         {"_id": room}, 
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

        debug(people[socket.id] + ' joined', room);
        socket.join(room);
    });

    socket.on('room.leave', function(room) {
        if(!room) {
            debug('ERROR: room.leave - room is undefined');
        }

        debug(people[socket.id] + ' left', room);
        socket.leave(room);
    });

});

module.exports = io;
