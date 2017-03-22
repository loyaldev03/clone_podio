var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	id: String,
	from: Object,
	message: String,
	created: Date,
	mentions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mention'}],
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('Comment', CommentSchema);