var mongoose = require('mongoose');

var MentionSchema = new mongoose.Schema({
	id: String,
	from: Object,
	message: String,
	created: Date,
	comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
});

mongoose.model('Mention', MentionSchema);