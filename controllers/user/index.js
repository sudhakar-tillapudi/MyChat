var express = require('express');
var miniapp = express.Router();

miniapp.get(['/user','/user/index'],function(req, res, next)
{
    req.app.locals.PageName = 'Chat';
    res.render('user/index');
});

module.exports = miniapp;