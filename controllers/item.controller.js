var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  

var exports = module.exports; 

exports.createValue = function(item_id, field_id, _value) {
  return new Promise(function(resolve, reject){
    var value = new Value({
      item: item_id,
      field: field_id,
      value: _value
    });
    value.save(function(err, value) {
      if (err) { return reject(err); }
      return resolve(value);
    })    
  })
};

exports.getItemsForAppp = function(appp_id) {
	return new Promise(function(resolve, reject){
		try{
			Appp.findById({_id: appp_id}, function(err, appp){
				if (err) {
					return reject(err);
				}
				Value.aggregate([
					{
						$lookup:
						{
							from: "fields",
							localField: "field",
							foreignField: "_id",
							as: "resolved_field"
						}
					},
					{	
						$group: 
						{
							_id: "$item", 
							fields: 
							{
								$addToSet: 
								{
									field: {
										$arrayElemAt: ["$resolved_field", 0]
									},
									value: "$value"
								}
							}
						}
					}
				]).exec(function(err, items){
					if (err) {
						return reject(err);
					}
					var _items = [];
					items.forEach(function(item){
						if (appp.items.indexOf(item._id) >= 0) {
							_items.push(item);
						}
					})
					return resolve(_items);
				})		

			})
		}
		catch(err){
			return reject(err);
		}
	})
}