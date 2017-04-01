var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
	appp: {type: mongoose.Schema.Types.ObjectId, ref: 'Appp'},
	fields: [{type: mongoose.Schema.Types.ObjectId, ref: 'Field'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Item', ItemSchema);