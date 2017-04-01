var mongoose = require('mongoose');

var ValueSchema = new mongoose.Schema({
	item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
	field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field'},
	value: String	
});

mongoose.model('Value', ValueSchema);