var express = require('express'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport');
var morgan = require('morgan');
var fs = require('fs')
var properties = require('../lib/envProperties');

//var accessLogStream = fs.createWriteStream(properties.ACCESS_LOG, {flags: 'a'})

module.exports = function(app, config) {
    app.configure(function() {
        var done = false;
        app.set('views', config.rootPath + '/server/views');
        app.set('view engine', 'jade');
        app.use(cookieParser());
        app.use(express.bodyParser({uploadDir:'./public/img/uploads'}));
        app.use(session({secret:'use the force',resave:false,saveUninitialized:false}));
        app.use(passport.initialize());
        app.use(passport.session());
        //app.use(morgan('combined', {stream: accessLogStream}));
        //app.use(morgan('dev')); //LOCAL LOGGIN      

        app.use(express.static(config.rootPath + '/public'));
        
    });
}