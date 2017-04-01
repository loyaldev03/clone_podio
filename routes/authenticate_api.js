var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Workspace = mongoose.model('Workspace');
var Appp = mongoose.model('Appp');
require('../config/passport');
var express = require('express');
var router = express.Router();
var MailSender = require('../helpers/mail_sender');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//import controllers
var workspace_controller = require('../controllers/workspace.controller');

router.post('/register', function(req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}
	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	user.save(function(err, user) {
		if(err) {
			return next(err);
		}
		debugger;
		workspace_controller.createDefaultWorkspace(user)
		.then(function(workspace){
			debugger;
			return res.json({token: user.generateJWT()});
		})
		.catch(function(err) {
			debugger;
			return next(err);
		})
		MailSender.sendVerificationMessage(user);
	});
})

router.post('/login', function(req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}
	
	passport.authenticate('local', function(err, user, info){
		if (err) {return next(err);}
		if (user) {
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
})

router.post('/activate/:id', function(req, res, next) {
  User.update({_id: req.params.id}, {activated: true}, function(err, _res) {
  	if (err) { return next(err); }
  	User.findById(req.params.id, function(err, user) {
  		if (err) { return next(err); }
  		return res.json({ token: user.generateJWT() });
  	})
  })
})

module.exports = router;
