var express = require('express');
var miniapp = express.Router();
var fileUpload = require('express-fileupload');

miniapp.use(fileUpload());

miniapp.get('/register',function(req, res, next)
{
    res.render('Register');
});

miniapp.post('/ValidateUserRegistration',function(req, res, next)
{
    //upload profile to images folder
    var photo = req.files.ProfilePhoto;
    photo.mv(__dirname+'/../images/'+req.body.email+".jpg");
    //photo.name.substring(photo.name.indexOf('.')+1));
    

    //save user info in the mongodb
    var mongoClient = require('mongodb').MongoClient;
    mongoClient.connect("mongodb://localhost:27017", function (error, client) {
    if (error)
        return console.log('unable to connect to mongodb server... error : ', error);

    console.log('connected mongodb server successfully!');

    var mongodb = client.db('mychat');
    mongodb.collection('users').insertOne({
        _id:req.body.emailid,
        name: req.body.name,
        password: req.body.passwd
    }, function (err, result) {
        if (error)
            return console.log('error while creating record. error : ',error);
        console.log(result.ops);
    });
    client.close();
});



    //render success page
    res.render('RegistrationSuccess');
});

module.exports = miniapp;