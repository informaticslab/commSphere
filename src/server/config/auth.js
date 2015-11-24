'use strict';

var passport = require('passport');
var mongoose = require('mongoose');

exports.authenticate = function(req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    var auth = passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.send({
                success: false
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.send({
                success: true,
                user: user
            });
        });
    });
    auth(req, res, next);
};

exports.requiresApiLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};

exports.requiresRole = function() {
    return function(req, res, next) {
        console.log(req.user.roles);
        if (!req.isAuthenticated() || !req.user.roles.levelTwo === true) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    };
};

exports.authenticatePIV = function(req, res) {

    var authorized = req.connection.authorized;
    var User = mongoose.model('User');
    // var protocol = req.conneciton.npnProtocol;
    var userId ="";
    var displayName = "";

    var pivUserID, pivUserName,pivFirstName,pivLastName,pivDisplayName;
    var pivinfo=req.connection.getPeerCertificate().subject;

    if(pivinfo != undefined && (pivinfo.UID != undefined || pivinfo.CN != undefined)){

         if(pivinfo.UID != undefined){
            pivUserID = pivinfo.UID.substr(0,pivinfo.UID.indexOf(' '));
            pivUserName = pivinfo.UID.substring(pivinfo.UID.indexOf('CN=')+3, pivinfo.UID.indexOf('-A')-1);
            pivFirstName = pivUserName.substring(0,pivUserName.indexOf(' '));
            pivLastName = pivUserName.substring(pivUserName.lastIndexOf(' '));
            pivDisplayName = pivFirstName +pivLastName;
            
        } else if(pivinfo.CN != undefined){
            pivUserID = pivinfo.CN.substring(pivinfo.CN.indexOf('ID=')+3);
            pivUserName = pivinfo.CN.substring(0, pivinfo.CN.indexOf('-A')-1);
            pivFirstName = pivUserName.substring(0,pivUserName.indexOf(' '));
            pivLastName = pivUserName.substring(pivUserName.lastIndexOf(' '));
            pivDisplayName = pivFirstName +pivLastName;
        }

        User.findOne({'id': pivUserID}, function(err, user) {
            if(err) {
                return err
            } else if(user) {
                if(authorized) {
                    user.lastLogin = new Date();
                    user.save(function(err) {
                        if(err){
                            throw err;
                        } else {
                            req.logIn(user, function(err) {
                                if(err) {return next(err);}
                                res.send({success: true, user: user});
                            })
                        }
                    });
                    userId = user._id;
                    displayName = user.displayName
                } else {
                    res.send({success: false});
                }
            } else {
                var newUser = new User();
                newUser.id = pivUserID;
                newUser.firstName = pivFirstName;
                newUser.lastName = pivLastName;
                newUser.displayName = pivDisplayName;
                newUser.lastLogin = new Date();
                newUser.roles = [{id:'levelOne', name:'Admin', enabled: false},
                                {id:'levelTwo', name:'Coordinator', enabled: false},
                                {id:'levelThree', name: 'Analyst', enabled: true},
                                {id:'disabled', name: 'Disabled', enabled: false}];

                newUser.save(function(err) {
                    if(err) {
                        throw err;
                    } else {
                        req.logIn(newUser, function(err) {
                            if(err) {return next(err);}
                            res.send({success: true, user: newUser});
                        });
                    }
                });

                userId = newUser._id;
                displayName = newUser.displayName;
            }
        });
    } else {
        res.send({success: false});
    }
};