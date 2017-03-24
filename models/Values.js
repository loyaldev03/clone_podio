var mongoose = require('mongoose');

var ValueSchema = new mongoose.Schema({
	item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
	field: {type: moongoose.Schema.Types.ObjectId, ref: 'Field'},
	value: string	
});

mongoose.model('Value', ValueSchema);