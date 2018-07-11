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
    photo.mv(__dirname+'/../images/'+req.body.email+"."+
    photo.name.substring(photo.name.indexOf('.')+1));
    

    //save user info in the mongodb

    //render success page
    res.render('RegistrationSuccess');
});

module.exports = miniapp;