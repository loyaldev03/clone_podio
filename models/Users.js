var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	username: String,
	hash: String,
	salt: String, 
	title: String,
	role: String,
	image: String,
	about: String,
	skills: String,
	email: String,
	phone: String,
	website: String,
	skype: String,
	linkedin: String,
	twitter: String,
	location: String,
	address: String,
	city: String,
	zip: String,
	state: String,
	country:String,
	activated: {
		type: Boolean,
		default: false
	},
	facebook: {
		type: mongoose.Schema.Types.Mixed
	},
	twitter: {
		type: mongoose.Schema.Types.Mixed
	},
	default_workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
	workspaces: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'}]
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return this.hash === hash;
}

UserSchema.methods.generateJWT = function() {
	//set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		_id: this._id,
		username: this.username,
		activated: this.activated,
		exp: parseInt(exp.getTime() / 1000),
	}, 'SECRET');
}
mongoose.model('User', UserSchema);
