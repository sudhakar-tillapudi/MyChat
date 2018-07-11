// import modules
var express = require('express');
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
app.listen(3000);

