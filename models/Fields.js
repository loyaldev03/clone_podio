var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema({
	name: string,
	type: string,
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

mongoose.model('Field', FieldSchema);