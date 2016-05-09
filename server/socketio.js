var io = require('socket.io')({
    transports: ['websocket','xhr-polling']
});
var chatsCollection = require('../config.json').COLLECTIONS.CHATS;
var mongoUtils = require('./utils/mongo');
var debug = require('debug')('server/socketio');

var people = [];

io.on("connection", function (socket) {

    var defaultRoom = 'general';

    socket.join(defaultRoom); 
//    socket.leave(socket.id); //Leave socket.io default room

    debug("A user connected");
    socket.on('disconnect', function () {
        debug(people[socket.id] + ' disconnected');
        delete people[socket.id];
    });

    socket.on('client-disconnect', function() {
        socket.disconnect();
    });


    socket.on('logged-in', function(userData) {
        people[socket.id] = userData.name;
        debug(userData.name + ' Logged in');
        socket.join('notifications-' + userData.role);
        io.emit('notification', {message: userData.name + ' Logged In', timestamp: new Date().toDateString()}); //FUTURE Notification Testing
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
