var fs = require('fs');
var express = require('express');
var mysql = require('mysql');
var url = require("url");
var session = require('express-session');
var passport = require('passport');
var fileUpload = require('express-fileupload');
var app = express();
//var bodyParser = require('body-parser')
//app.use(bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//  extended: true
//}));
app.use(fileUpload());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
   resave: true,
     saveUninitialized: true,
     secret: "sudhakar key"
    }));

app.use(function(req, res, next) {
  
 //console.log('loggedin name :'+req.session.LoggedinEmailId);
  res.locals.LoggedinEmailId = req.session.LoggedinEmailId;
  res.locals.LoggedinUserId = req.session.LoggedinUserId;
  next();
});

//setting view engine to ejs
app.set('view engine', 'ejs');

//Adding routes
var indexRoute = require('./routes/index');
app.use(indexRoute);

var searchRoute = require('./routes/Search');
app.use(searchRoute);

var MovieDetailsRoute = require('./routes/MovieDetails');
app.use(MovieDetailsRoute);


var bookMyTicketRoute = require('./routes/BookMyTicket');
app.use(bookMyTicketRoute);

var userBookMyTicketRoute = require('./routes/User/BookMyTicket');
app.use(userBookMyTicketRoute);

var myTicketsRoute = require('./routes/MyTickets');
app.use(myTicketsRoute);

var myTicketsUserRoute = require('./routes/User/MyTickets');
app.use(myTicketsUserRoute);

var cancelTicketRoute = require('./routes/CancelTicket');
app.use(cancelTicketRoute);

var cancelUserTicketRoute = require('./routes/User/CancelTicket');
app.use(cancelUserTicketRoute);

var loggedInUserDetails = {
  UserId: -1,
  UserName: '',
  FirstName: '',
  LastName: '',
  MobileNo: ''
};
//load the static resources
app.use(['/css','/User/css'], express.static('css'));
app.use(['/js','/User/js'], express.static('js'));
app.use(['/fonts','/User/fonts'], express.static('fonts'));
app.use(['/images','/User/images'], express.static('images'));

//routing
//   app.get(['/','/index'],function(req,res){
//   fs.createReadStream(__dirname+'/index.html').pipe(res);
// });


// app.get('/login', function (req, res) {
//   app.locals.PageName = 'login';
//   res.render('login');
// });

app.get('/login', function(req, res, next) {
  
  req.app.locals.PageName = 'login';
  res.render('login', { title: 'Please Sign In with:' });
});

// app.get('/google',
//   passportGoogle.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

// app.get('/google/callback',
//   passportGoogle.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.get('/register', function (req, res) {
  res.render('Register');
});


app.post('/ValidateUserRegistration', function (req, res) {
  //handle user registration here
  //console.log(req.query);

  //uploading profilePhoto to images folder
  //console.log(req.files.ProfilePhoto);
  var photo = req.files.ProfilePhoto
  photo.mv(__dirname+'/images/'+req.body.email+"."+photo.name.substring(photo.name.indexOf('.')+1), function(err) {
    if (err)
      return res.status(500).send(err);
 
    //res.send('File uploaded!');
  });
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moviesheep'
  });
  connection.connect(function (err) {
    if (err)
      console.log('error @' + err);
    console.log('connected to mysql');

    var userData = {
      emailid: req.query.email,
      firstname: req.query.firstname,
      lastname: req.query.lastname,
      mobileno: req.query.mobileno,
      password: req.query.passwd
    };
    connection.query("insert into users set ?", userData, function (err) {
      if (err)
        throw err;
      console.log('User Registration Completed Successfully!');

      //now show the messagebox to user and navigate to login page
      //alert('User Registration Completed Successfully!');
      //res.end("User Registration Completed Successfully!");
      res.render('RegistrationSuccess');
    });
    connection.end();
  });
});

app.get('/ValidateUserLogin', function (req, res) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moviesheep'
  });

  connection.connect(function (err) {
    if (err)
      console.log('error @' + err);
    console.log('connected to mysql');
    var loginData = {
      EmailId: req.query.emailid,
      Password: req.query.password
    };
    console.log(req.url);
    console.log('executing select query');
    connection.query("select * from users  where EmailId='" + req.query.emailid + "' and Password='" + req.query.password + "'", function (err, result, feilds) {
      if (err)
        throw err;
      console.log(result);

      if (result.length > 0) {
        console.log(result[0].Id);

        //setting session variables here
        req.session.LoggedinEmailId = result[0].EmailId;
        req.session.LoggedinUserId = result[0].Id;

        loggedInUserDetails.UserId = result[0].Id;
        loggedInUserDetails.UserName = result[0].EmailId;
        loggedInUserDetails.FirstName = result[0].FirstName;
        loggedInUserDetails.LastName = result[0].LastName;
        loggedInUserDetails.MobileNo = result[0].MobileNo;
        res.json({
          status: 1
        });
        //fs.createReadStream(__dirname+'/index.html').pipe(res);
      }
      else {
        res.json({
          status: -1
        });
      }



      //now show the messagebox to user and navigate to login page
      //alert('User Registration Completed Successfully!');
      //res.end("User Registration Completed Successfully!");
      //res.sendFile(__dirname+'/Index.html');
    });
    connection.end();
  });
});

//this route will get the loggedin user info - its a kind of session
app.get('/GetLoggedInUserInfo', function (req, res) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moviesheep'
  });

  connection.connect(function (err) {
    if (err)
      console.log('error @' + err);
    console.log('connected to mysql');
    var loginData = {
      EmailId: req.query.emailid,
      Password: req.query.password
    };
    console.log(req.url);
    connection.query("select * from users  where Id=" + loggedInUserDetails.UserId + "", function (err, result, feilds) {
      if (err)
        throw err;
      console.log(result);

      if (result.length > 0) {
        console.log('GetLoggedInUserInfo inside');
        loggedInUserDetails.UserId = result[0].Id;
        loggedInUserDetails.UserName = result[0].EmailId;
        loggedInUserDetails.FirstName = result[0].FirstName;
        loggedInUserDetails.LastName = result[0].LastName;
        loggedInUserDetails.MobileNo = result[0].MobileNo;
        console.log('userid found = ' + loggedInUserDetails.UserId);
        //fs.createReadStream(__dirname+'/index.html').pipe(res);

      }
      console.log('sending resposne');
      console.log(loggedInUserDetails);
      res.json(loggedInUserDetails);




      //now show the messagebox to user and navigate to login page
      //alert('User Registration Completed Successfully!');
      //res.end("User Registration Completed Successfully!");
      //res.sendFile(__dirname+'/Index.html');
    });

    connection.end();
  });
  //sending resposne

});

app.get('/User/', function (req, res) {
  app.locals.PageName = 'UserHome';
  res.render('User/UserHome');
});


app.get('/Logout', function (req, res) {
  app.locals.PageName = 'Login';
  console.log('log out here : '+req.session.LoggedinEmailId);
  req.session.destroy();
  // req.session.LoggedinEmailId = '';
  // req.session.LoggedinUserId = '';
  //console.log('log out here finished : '+req.session.LoggedinEmailId);
  res.render('login');
});


app.get('/User/Account', function (req, res) {
  app.locals.PageName = 'ViewMyAccount';
  res.render('User/ViewMyAccount');
});

app.get('/User/Edit', function (req, res) {
  app.locals.PageName = 'EditMyAccount';
  res.render('User/EditMyAccount');
});

app.post('/ValidateMyAccountEdit', function (req, res) {
  console.log('ValidateMyAccountEdit came!');
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moviesheep'
  });

  connection.connect(function (err) {
    if (err)
      console.log('error @' + err);
    console.log('connected to mysql');
    var loginData = {
      EmailId: req.query.emailid,
      Password: req.query.password
    };
    //string updateQuery ="";
    console.log("update users set firstname = '" + req.body.FirstName + "', LastName = '" + req.body.LastName + "', MobileNo='" + req.body.MobileNo + "' where EmailId = '" + req.body.UserName + "' and ID = " + req.body.Id);
    connection.query("update users set firstname = '" + req.body.FirstName + "', LastName = '" + req.body.LastName + "', MobileNo='" + req.body.MobileNo + "' where EmailId = '" + req.body.UserName + "' and ID = " + req.body.Id + "", function (err, result, feilds) {
      if (err)
        throw err;
      console.log('affected rows : ' + result.affectedRows);

      if (result.affectedRows > 0) {
        res.json({
          status: 1
        });
        //fs.createReadStream(__dirname+'/index.html').pipe(res);
      }
      else {
        res.json({
          status: -1
        });
      }
    });
    connection.end();
  });
});


app.get('/User/ChangePassword', function (req, res) {
  app.locals.PageName = 'ChangePassword';
  res.render('User/ChangePassword');
});

app.get('/GetLoggedInSession', function (req, res) {
  console.log('GetLoggedInSession req came');
  console.log(loggedInUserDetails);
  res.json({
    session: loggedInUserDetails
  });
});

app.post('/ValidateChangePassword', function (req, res) {
  console.log('ValidateChangePassword request came');
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'moviesheep'
  });

  connection.connect(function (err) {
    if (err)
      console.log('error @' + err);
    console.log(req.body);
    connection.query("update users set Password = '" + req.body.NewPassword + "' where EmailId = '" + loggedInUserDetails.UserName + "' and Id = " + loggedInUserDetails.UserId + " and Password='"+req.body.CurrentPassword+"'", function (err, result, feilds) {
      if (err)
        throw err;
      console.log('effected rows : ' + result.affectedRows);

      if (result.affectedRows > 0) {
        res.json({
          status: 1
        });
      }
      else {
        res.json({
          status: -1
        });
      }
    });
    connection.end();
  });
});


app.listen(3000);

console.log("server started on port 3000... Enjoy working");

//User Routes

var bookATicketRoute = require('./routes/User/BookATicket');
app.use(bookATicketRoute);

var userMovieDetailsRoute = require('./routes/User/MovieDetails');
app.use(userMovieDetailsRoute);

var GetGuestAvailableSeatsRoute = require('./routes/GetGuestAvailableSeats');
app.use(GetGuestAvailableSeatsRoute);

var CancelMyTicketRoute = require('./routes/CancelMyTicket');
app.use(CancelMyTicketRoute);

var CancelUserMyTicketRoute = require('./routes/User/CancelMyTicket');
app.use(CancelUserMyTicketRoute);



var auth = require('./routes/auth');

app.use(auth);