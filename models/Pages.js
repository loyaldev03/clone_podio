var mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({
	category: String,
	name: String,
	id: String,
	access_token: String,
	posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
	account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
});

mongoose.model('Page', PageSchema);