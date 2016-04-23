var io = require('socket.io')({
    transports: ['websocket','xhr-polling']
});
var chatsCollection = require('../config.json').COLLECTIONS.CHATS;
var mongoUtils = require('./utils/mongo');
var debug = require('debug')('server/socketio');
 

io.on("connection", function (socket) {

    var defaultRoom = 'general';

    socket.join(defaultRoom); 
    socket.leave(socket.id); //Leave socket.io default room

    debug("A user connected");
    socket.on('disconnect', function () {
        debug('user disconnected');
    });


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
                         function(result) {
                            debug('update chat', JSON.stringify(result));
        });
        
    });

    socket.on('room.join', function(room) {
        if(!room) {
            console.error('[socket.io] room.join - room is undefined');
        }

        socket.join(room);
    });

    socket.on('room.leave', function(room) {
        if(!room) {
            console.error('[socket.io] room.leave - room is undefined');
        }
        socket.leave(room);
    });

});

module.exports = io;
