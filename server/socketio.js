var io = require('socket.io')();
var mongoUtils = require('./mongoUtils');

io.on("connection", function (socket) {

    var defaultRoom = 'general';

    socket.join(defaultRoom);
    socket.leave(socket.id);

    console.log("A user connected");
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });


    socket.on('message', function(message, room) {

        if(room && room !== '') {
            socket.broadcast.to(room).emit('message', message);
        } else {
            socket.broadcast.to(defaultRoom).emit('message', message);
        }

        // mongoUtils //TODO insert message to mongoDB;
        //save to chat history
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
    });

});

module.exports = io;