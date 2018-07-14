// import modules
var express = require('express');
var socket = require('socket.io');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var session = require('express-session');

//middleware
app.use(['/css','/user/css'],express.static('css'));
app.use(['/fonts','/user/fonts'],express.static('fonts'));
app.use(['/images'],express.static('images'));
app.use(['/js','/user/js'],express.static('js'));
app.set('view engine','ejs');

app.use(session({
   resave: true,
     saveUninitialized: true,
     secret: "sudhakar key"
    }));

app.use(function(req,res,next){
    res.locals.loggedinEmailId = req.session.emailId;;
    res.locals.loggedinName = req.session.name;
    next();
});


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
require('./controllers/chat/handlechatmessage')(data,io);
    });
console.log('made socket connection');
});

app.get('/ValidateUserLogin',function(req,res){
    mongoClient.connect("mongodb://localhost:27017", function (error, db) {
    if (error)
        return console.log('unable to connect to mongodb server... error : ', error);

    console.log('connected mongodb server successfully!');

    var mongodb = db.db('mychat');
    
    mongodb.collection('users').find({
        _id:req.query.emailid,
        password : req.query.password
    }).toArray(function (err, result) {
        if (error)
            return console.log('error while creating record');
            console.log('email count : '+result.length);
            if(result.length == 1)
            {
                req.session.emailId = req.query.emailid;
                req.session.name = result[0].name;
            }
        res.json({
            status : result.length == 0 ? -1 : 1
        });
    });
    db.close();
});
});


app.get('/IsEmailIdExists',function(req,res){
    console.log('received emailid = '+req.query.EmailId);

    //check wether emailid is valid or not.
    

mongoClient.connect("mongodb://localhost:27017", function (error, db) {
    if (error)
        return console.log('unable to connect to mongodb server... error : ', error);

    console.log('connected mongodb server successfully!');

    var mongodb = db.db('mychat');
    mongodb.collection('users').find({
        _id:req.query.EmailId
    }).count(function (err, result) {        
        if (error)
            return console.log('error while creating record');
            console.log('email count : '+result);
        res.json({
            IsValid : result == 0 ? true : false
        })
    });
    db.close();
});

});

//
