var mongoose = require('mongoose');

var TweetSchema = new mongoose.Schema({
	id: String,
	id_str: String,
	in_reply_to_screen_name: String,
	in_reply_to_status_id: String,
	in_reply_to_status_id_str: String,
	in_reply_to_user_id: String,
	in_reply_to_user_id_str: String,
	created_at: Date,
	text: String,
	account: { type: mongoose.Schema.Types.ObjectId, ref: 'TweetAccount'},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Tweet', TweetSchema);