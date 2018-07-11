var express = require('express');
var miniapp = express.Router();

miniapp.get('/login',function(req, res, next)
{
    res.render('login');
});

module.exports = miniapp;