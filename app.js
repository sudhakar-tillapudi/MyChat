// import modules
var express = require('express');
var socket = require('socket.io');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var session = require('express-session');

var port = process.env.PORT || 3000;

console.log(process.env.MONGODBUSERNAME +' and '+process.env.MongoDbPassword);

//middleware
app.use(['/css', '/user/css'], express.static('css'));
app.use(['/fonts', '/user/fonts'], express.static('fonts'));
app.use(['/images'], express.static('images'));
app.use(['/js', '/user/js'], express.static('js'));
app.set('view engine', 'ejs');


app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "sudhakar key"
}));

app.use(function (req, res, next) {
    res.locals.loggedinEmailId = req.session.emailId;;
    res.locals.loggedinName = req.session.name;
    next();
});

app.locals.usersAvailability = {};

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
var server = app.listen(port);

var io = socket(server);
io.on('connection', function (socket) {

    //Join the particular room for sending messages to the specific user.
    socket.on('join', function (data) {
        if (!data.emailId)
            return;
        console.log('joining ' + data.emailId);
        socket.join(data.emailId,function(){
        app.locals.usersAvailability[data.emailId] = true;
        console.log('AvailabilityUpdated emitting');
        updateAvailability();
    });
    });

    function updateAvailability()
    {
        io.sockets.emit('AvailabilityUpdated', {
            Availability: app.locals.usersAvailability
        });
    }
    setInterval(updateAvailability,3000);
    socket.on('clientDisconnectedForcibly', function (data) {
        console.log('clientDisconnectedForcibly received');
        if (!data.emailId)
            return;
        app.locals.usersAvailability[data.emailId] = false;
        console.log('leaving room '+data.emailId);
        console.log(app.locals.usersAvailability);
        socket.leave(data.emailId);

        io.sockets.emit('AvailabilityUpdated', {

            Availability: app.locals.usersAvailability
        });
    });
    socket.on('disconnect', function (data) {
        // for(var room in socket.adapter.rooms.sockets){
        //     console.log(room.Room);
        // }

        //console.log('on disconnection =>' + data);
        //console.log(socket.client);
        if (!data.emailId)
            return;
        app.locals.usersAvailability[data.emailId] = false;
        io.sockets.emit('AvailabilityUpdated', {

            Availability: app.locals.usersAvailability
        });
    });
   

    socket.on('chat-message-request', function (data) {
        console.log('received  => chat-message-request : ' + data.message);
        require('./controllers/chat/handlechatmessage')(data, io);
    });

    socket.on('user-is-typing-request', function (data) {
        console.log("received => user-is-typing-request : " + data);
        require('./controllers/chat/handle-typing-message')(data, io);
    });

    socket.on('user-is-not-typing-request', function (data) {
        console.log("received => user-is-not-typing-request : " + data);
        require('./controllers/chat/handle-not-typing-message')(data, io);
    });

    socket.on('leave',function(data){
        console.log('leaving room '+data.emailId);
        socket.leave(data.emailId);
    });

    socket.on('msg-read-completed',function(data){
        console.log('msg-read-completed received');
        console.log(data);
        require('./controllers/chat/handle-msg-read-completed')(data, io);
    });
    console.log('made socket connection');
});

app.get('/GetOnlineStatus', function (req, res) {
    console.log(app.locals.usersAvailability);
    res.json({
        Availability: app.locals.usersAvailability
    });
})

app.get('/ValidateUserLogin', function (req, res) {
    console.log('login req came!');
    //mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
        mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected mongodb server successfully!');

        var mongodb = db.db('sudhamychat');

        mongodb.collection('users').find({
            _id: req.query.emailid,
            password: req.query.password
        }).toArray(function (err, result) {
            if (error)
                return console.log('error while creating record');
            console.log('email count : ' + result.length);
            if (result.length == 1) {
                req.session.emailId = req.query.emailid;
                req.session.name = result[0].name;
            }
            res.json({
                status: result.length == 0 ? -1 : 1
            });
        });
        db.close();
    });
});

app.get('/GetOldMessages', function (req, res) {
    mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected mongodb server successfully!');

        var mongodb = db.db('sudhamychat');

        mongodb.collection('messages').find(
            {
                $or: [{ $and: [{ sender: req.query.sender }, { receiver: req.query.receiver }] },
                { $and: [{ sender: req.query.receiver }, { receiver: req.query.sender }] }]
            },
        ).sort({
            sentDateTime: 1
        }).toArray(function (err, result) {
            if (error)
                return console.log('error while fetching records');
            console.log('messages count : ' + result.length);
            console.log(result[0]);
            res.json({
                messages: result
            });
        });
        db.close();
    });
});

app.get('/GetUnreadMsgs', function (req, res) {
    mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected mongodb server successfully!');

        var mongodb = db.db('sudhamychat');

        mongodb.collection('messages').find(
            {
                $or: [{ $and: [{ sender: req.query.sender }, { receiver: req.query.receiver }] },
                { $and: [{ sender: req.query.receiver }, { receiver: req.query.sender }] }]
            },
        ).sort({
            sentDateTime: 1
        }).toArray(function (err, result) {
            if (error)
                return console.log('error while fetching records');
            console.log('messages count : ' + result.length);
            console.log(result[0]);
            res.json({
                messages: result
            });
        });
        db.close();
    });
});


app.get('/IsEmailIdExists', function (req, res) {
    console.log('received emailid = ' + req.query.EmailId);

    //check wether emailid is valid or not.


    mongoClient.connect("mongodb://sudhakar:sudhakar333@ds247141.mlab.com:47141/sudhamychat", function (error, db) {
        if (error)
            return console.log('unable to connect to mongodb server... error : ', error);

        console.log('connected mongodb server successfully!');

        var mongodb = db.db('sudhamychat');
        mongodb.collection('users').find({
            _id: req.query.EmailId
        }).count(function (err, result) {
            if (error)
                return console.log('error while creating record');
            console.log('email count : ' + result);
            res.json({
                IsValid: result == 0 ? true : false
            })
        });
        db.close();
    });

});

app.get('/Signout',function(req,res){

    //destroy the session 
    req.session.destroy();

    //remove the resepctive client from io.sockets
    io.sockets.in(req.query)
    socket
    res.render('index');
});
