var express = require('express');
var miniapp = express.Router();

miniapp.get(['/','/index'],function(req, res, next)
{
    res.render('index');
});

module.exports = miniapp;