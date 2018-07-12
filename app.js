// import modules
var express = require('express');
var socket = require('socket.io');
var app = express();


//middleware
app.use('/css',express.static('css'));
app.use('/fonts',express.static('fonts'));
app.use('/images',express.static('images'));
app.use('/js',express.static('js'));
app.set('view engine','ejs');


//routes
var indexRoute = require('./controllers/index');
app.use(indexRoute);

var registerRoute = require('./controllers/Register');
app.use(registerRoute);

var loginRoute = require('./controllers/Login');
app.use(loginRoute);


//user routes
var indexUserRoute = require('./controllers/user/index');
app.use(indexUserRoute);

//let us listen to run server
var server = app.listen(3000);

var io = socket(server);
io.on('connection',function(socket)
{
    socket.on('chat-message-request',function(data){
        console.log('chat : '+data.message);
require('./controllers/chat/handlechatmessage')(data,socket);
    });
console.log('made socket connection');
});


//
