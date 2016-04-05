var io = require('socket.io')();

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });


    socket.on('message', function(message) {
        console.log('User:', message.user, ', sends:\"', message.content, '\"');

        socket.broadcast.emit('message', message);
        //save to chat history
    })

});

module.exports = io;