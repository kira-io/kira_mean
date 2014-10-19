var users = require('./../server/controllers/users.js');
// var user_session_id = null;
// var users_data = {};
// var answers = [];
// var geek_messages = [];
// var artist_messages = [];

module.exports = function Routes(app, io){
    io.sockets.on('connection', function(socket) {
        socket.on('client:join_room', function(data) {
            console.log('Client has joined', data.room);
            socket.join(data.room);
        });

        socket.on('client:change_room', function(data) {
            console.log('Client has left', data.prev_room);
            console.log('Client has joined', data.new_room);
            socket.leave(data.prev_room);
            socket.join(data.new_room);
        });

        socket.on('client:emit_message', function(data) {
            console.log('Client has emitted this message', data);
            io.to(data.room).emit('server:incoming_message', { name: data.name, message: data.message });
        });

        socket.on('disconnect', function(data) {
            // leave that room
        });
    });
};
