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
	var uid = require('rand-token').uid;
	//import controllers
	var workspace_controller = require('../controllers/workspace.controller');

	router.post('/register', function(req, res, next) {
		var register_user = req.body.user;
		var twitter_id = req.body.twitter_id;

		if (!register_user.username || !register_user.password) {
			return res.status(401).json({message: 'Please fill out all fields'});
		}
		User.findOne({email: register_user.email}, function(err, _user){
			if (err) {
				return next(err);
			}
			var user = new User();
			user.username = register_user.username;
			user.email = register_user.email;
			user.full_name = register_user.full_name;
			user.setPassword(register_user.password);
			user.verification_token =  uid(32);
			if (_user) {
				if (!_user.activated) {
					return res.status(401).json({message: 'email is not verified'});	 
				}
				else if (_user.hash) {
					return res.status(401).json({message: 'The email is already registered with us'});
				}
				else {
					user._id = _user._id;
					User.update({_id: _user._id}, user, function(err, _res){
						if (err) {
							return next(err);
						}
						User.findById(_user._id, function(err, _user){
							if (err) {
								return next(err);
							}
							workspace_controller.createDefaultWorkspace(_user)
							.then(function(workspace){
								MailSender.sendVerificationMessage(_user);
								return res.json({token: _user.generateJWT()});
							})
							.catch(function(err) {
								return next(err);
							})
						})
					})
				}
			}
			else {
				User.findOne({"twitter.id":twitter_id}, function(err, _user){
					if (err) {
						return next(err);
					}
					if (_user) {
						user._id = _user._id;
						User.update({_id: _user._id}, user, function(err, _res){
							if (err) {
								return next(err);
							}
							User.findById(_user._id, function(err, _user){
								if (err) {
									return next(err);
								}
								workspace_controller.createDefaultWorkspace(_user)
								.then(function(workspace){
									MailSender.sendVerificationMessage(_user);
									return res.json({token: _user.generateJWT()});
								})
								.catch(function(err) {
									return next(err);
								})
							})
						})						
					}
					else {
						user.save(function(err, user) {
							if(err) {
								return next(err);
							}
							workspace_controller.createDefaultWorkspace(user)
							.then(function(workspace){
								MailSender.sendVerificationMessage(user);
								return res.json({token: user.generateJWT()});
							})
							.catch(function(err) {
								return next(err);
							})
						});									
					}
				})
			}
		})
	})

	router.post('/register_organization', auth, function(req, res, next) {
		if (!req.body.organization) {
			return res.status(400).json({message: "Please input organization"});
		}
		User.update({_id: req.payload._id}, {organization: req.body.organization}, function(err, _res){
			if (err) {
				return next(err);
			}
			User.findById(req.payload._id, function(err, user){
				if (err) {
					return next(err);
				}			
				return res.json({token: user.generateJWT()});
			})		
		});
	});

	router.post('/login', function(req, res, next) {
		if (!req.body.username || !req.body.password) {
			return res.status(401).json({message: 'empty fields'});
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

	router.post('/activate/:email/:token', function(req, res, next) {
		User.findOne({email: req.params.email}, function(err, user){
			if (err) {
				return next(err);
			}
			if (user.verification_token === req.params.token) {
			  User.update({email: req.params.email}, {activated: true}, function(err, _res) {
			  	if (err) { return next(err); }
			  	User.findOne({email: req.params.email}, function(err, user) {
			  		if (err) { return next(err); }
						MailSender.sendWelcomeMessage(user);
			  		return res.json({ token: user.generateJWT() });
			  	})
			  })			
			}
		});
	})

	module.exports = router;

router.post('/send_confirmation_email/:email', function(req, res, next){
	User.findOne({email: req.params.email}, function(err, user){
		if (err) {
			return next(err);
		}

		MailSender.sendVerificationMessage(user).then(function(_res){
			debugger;
    	res.redirect("/#/verify/");
		});
	})
})

router.post('/send_password_reset_request_email', function(req, res, next)
{
	debugger;
	MailSender.sendPasswordResetRequestMessage(req.body.email).then(function(err, _res) {
		if (err) {
			return next(err);
		}
		return res(_res);
	});
})

router.post('/password_reset', function(req, res, next) {
	var email = req.body.email;
	var token = req.body.token;
	var password = req.body.password;
	User.findOne({email: email}, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({message: "No User"});
		}
		if (user.password_reset_token != token) {
			return res.status(401).json({message: "Token doesn't match"});
		}
		user.setPassword(password);
		user.save(function(err, _res){
			if (err) {
				return next(err);
			}
			return res.json(_res);
		})
	})
})