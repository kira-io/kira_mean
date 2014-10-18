var express = require('express')
  , path = require('path')
  , app = express()
  , config = require('./config/mongoose');
// configure environments
app.configure(function(){
 	app.set('views', path.join(__dirname, 'views'));
 	app.set('view engine', 'ejs');
 	app.use(express.favicon());
 	app.use(express.logger('dev'));
 	app.use(express.json());
 	app.use(express.urlencoded());
 	app.use(express.bodyParser()); //to allow handling of POST data
 	app.use(express.cookieParser()); //to allow session handling
 	app.use(express.session({secret: 'monkey'})); //for using sessions
 	app.use(app.router);
 	app.use(express.static(path.join(__dirname, 'public')));
})
// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}
var server = app.listen(7777);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server
require('./config/routes')(app, io);
console.log("Express server listening on port 7777");