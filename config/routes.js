var users = require('./../server/controllers/users.js');
// var user_session_id = null;
// var users_data = {};
// var answers = [];
// var geek_messages = [];
// var artist_messages = [];

module.exports = function Routes(app, io){

    io.sockets.on('connection', function(socket) {
      socket.on('in_all_posts', function(data){
        console.log('IN ALL POSTS', socket.rooms);
      });
      socket.on('client:join_room', function(data) {
        if (socket.rooms.length > 1 && socket.rooms[1] != data.room) {
          console.log('LEAVING ROOM', socket.rooms[1]);
          socket.leave(socket.rooms[1]);
          socket.join(data.room);
        } else {
          socket.join(data.room);
        }
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

      socket.on('client:give_joy', function(data) {
        console.log('client clicked on', data.id);
        socket.broadcast.emit('server:update_joys', { post: data.id });
      });

      socket.on('client:limbo_room', function (data){
        io.emit('server:expired_room', {room_num: data.room_number})
      });

      socket.on('disconnect', function(data) {
        socket.disconnect();
        socket.leave(data.room);
      });
  });
};

