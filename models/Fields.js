var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema({
	name: String,
	type: String,
	appp: {type: mongoose.Schema.Types.ObjectId, ref: 'Appp'},
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

mongoose.model('Field', FieldSchema);