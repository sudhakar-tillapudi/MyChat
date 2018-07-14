var express = require('express');
var mongoClient = require('mongodb').MongoClient;

var miniapp = express.Router();

miniapp.get(['/user','/user/index'],function(req, res, next)
{
    
    req.app.locals.PageName = 'Chat';
    mongoClient.connect("mongodb://localhost:27017", function (error, db) {
    if (error)
        return console.log('unable to connect to mongodb server... error : ', error);

    console.log('connected mongodb server successfully!');

    var mongodb = db.db('mychat');
    mongodb.collection('users').find({
        _id:{'$ne':req.session.loggedinEmailId}
    }).toArray(function (err, result) {
        if (error)
            return console.log('error while creating record');
            //console.log(result[0]);
         res.render('user/index',{
         Users : result
     });
    });
    db.close();
});
    
});

module.exports = miniapp;