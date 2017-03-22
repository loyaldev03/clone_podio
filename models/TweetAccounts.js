var mongoose = require('mongoose');

var TweetAccountSchema = new mongoose.Schema({
	id: String,
	id_str: String,
	name: String,
	screen_name: String,
	followers_count: Number,
	friends_count: Number,
	statuses_count: Number,
	access_token_key: String,
	access_token_secret: String,
	tweets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}],
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('TweetAccount', TweetAccountSchema);