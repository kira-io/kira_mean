var users = require('./../server/controllers/users.js');
// var user_session_id = null;
// var users_data = {};
// var answers = [];
// var geek_messages = [];
// var artist_messages = [];

module.exports = function Routes(app, io){
 	app.get('/', function (req,res){ 
 		// req.session.page = 'index'; 
 		console.log('request', req.session);
 		console.log('request', req.sessionID);
 		// user_session_id = req.sessionID;  
 		users.index(req,res) 
 	});

 	app.get('/users', function (req,res){ 
 		// req.session.name = 'mike'; 
 		console.log('REQUEST', req.session); 
 		users.index(req,res) 
 	});

  	app.get('/users/index.json', function (req,res){ 
  		users.index_json(req,res) 
  	});

 	app.get('/users/new', function (req,res){ 
 		users.new(req,res) 
 	});

 	app.post('/users/create', function (req,res){ 
 		users.create(req,res) 
 	});

 	app.get('/users/:id', function (req,res){ 
 		users.show(req,res) 
 	});

 	app.get('/users/:id/edit', function (req,res){ 
 		users.edit(req,res) 
 	});

 	app.post('/users/newUser_json', function (req,res){ 
 		users.newUser_json(req,res) 
 	});

 	io.sockets.on('connection', function (socket){

  		console.log('A new user connected!');
  		console.log('socket.id', socket.id);
  		
  		//add user to inital room
  		socket.on('client:join_room', function (data){
	 		  socket.join(data.room);
        // io.to(data.room).emit('message', {name: 'eric', message: 'message'}); //emitting to room
	 		  socket.emit('get_name'); //emitting to user to get user name
	 	  });

  		//removes user from previous room to join new room
  		socket.on('client:change_room', function (data){
  			socket.leave(data.prev_room)
  			socket.join(data.new_room)
        socket.emit('get_name'); //emitting to room
  		});

      socket.on('user_name', function (data){
        socket.emit('name', {name: data.name})
      })

  		//listens for chat message from client to broadcast to other users in the room
  		socket.on('client:emit_message', function (data){
  			io.to(data.room).emit('server:incoming_message', {name: data.name, message: data.message})
  		});

      socket.on('client:room_expired', function(data){
        io.emit('server: room_expired', {post_id: data.post_id})
      })
	 	   
      socket.on('client: limbo_room', function (data){
        io.to(data.post_id).emit('server: expired_room')
      })
      
  		socket.emit('info',{ msg: 'The world is round, there is no up or down.' }); //sending a message to just that person

	  	io.emit('global_event', { msg: 'hello' }); //broadcasting to everyone

	  	socket.broadcast.emit('event', {msg: 'hi' }); //broadcasting an event to everyone except the person you established the socket connection to
	  	
	  	socket.on('my other event', function (data){ 
	  		console.log(data); 
	  	}); //listening for an event
	  	
	  	socket.on('disconnect', function (){ 
	  		io.sockets.emit('user disconnected'); 
	  	});
 	});
};