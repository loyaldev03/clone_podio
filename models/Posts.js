var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	id: String,
	message: String,
	created: Date,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	full_picture: String,
	page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page'}
});

mongoose.model('Post', PostSchema);