var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	id: String,
	email: String,
	first: String,
	last: String,
	name: String,
	url: String,
	id_str: String,
	screen_name: String,
	description: String,
	followers_count: Number,
	friends_count: Number,
	listed_count: Number,	
	created_at: Date,
	image: String,
	address: String,
	type: String
});

UserSchema.index({id: 1}, {unique: true});
mongoose.model('User', UserSchema);