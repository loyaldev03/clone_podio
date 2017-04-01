var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  

//import controllers
var field_controller = require('./field.controller');

var exports = module.exports; 

exports.createDefaultAppp = function(workspace){
  return new Promise(function(resolve, reject) {
    var appp = new Appp({
			name: "Property Management",
			item_name: "Property",
			workspace: workspace._id
		});
		appp.save(function(err, appp) {
			if (err) {
				return reject(err);
			}
			Workspace.update({_id: workspace._id}, {$addToSet: {appps: appp._id}, default_appp: appp._id}, function(err, workspace){
				if (err) {
					return reject(err);
				}
				debugger;
				field_controller.createDefaultFields(appp)
				.then(function(fields){
					return resolve(appp);
				})
				.catch(function(err) {
					return reject(err);
				})
			})
		})
  });
};