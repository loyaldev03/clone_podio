var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  

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

exports.createDefaultFields = function(appp){
  var default_fields = [
    { name: "name", type: "text"},
    { name: "sex", type: "text"},
    { name: "birthday", type: "text"},
  ];
  return new Promise(function(resolve, reject){
    Promise.all(default_fields.map(function(field){ return createField(field, appp);}))
    .then(function(res) {
      return resolve(res);
    })
    .catch(function(err) {
      return reject(err);
    });    
  })
} 
var createField = function(param, appp) {
  return new Promise(function(resolve, reject){
    param["appp"] = appp._id;
    param["appp"] = appp._id;
    debugger;
    var field = new Field(param);
    var field = new Field(param);

    field.save(function(err, field) {
      debugger;
      if (err) { return reject(err); }
      Appp.update({_id: appp._id}, {$addToSet: {fields: field._id}}, function(err, appp) {
          if (err) {return reject(err);}
          return resolve(field);
      });
    })
  })
}

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

exports.createDefaultFields = function(appp){
  var default_fields = [
    { name: "name", type: "text"},
    { name: "sex", type: "text"},
    { name: "birthday", type: "text"},
  ];
  return new Promise(function(resolve, reject){
    Promise.all(default_fields.map(function(field){ return createField(field, appp);}))
    .then(function(res) {
      return resolve(res);
    })
    .catch(function(err) {
      return reject(err);
    });    
  })
} 
var createField = function(param, appp) {
  return new Promise(function(resolve, reject){
    param["appp"] = appp._id;
    debugger;
    var field = new Field(param);
    field.save(function(err, field) {
      debugger;
      if (err) { return reject(err); }
      Appp.update({_id: appp._id}, {$addToSet: {fields: field._id}}, function(err, appp) {
          if (err) {return reject(err);}
          return resolve(field);
      });
    })
  })

    return new Promise(function(resolve, reject){
    param["appp"] = appp._id;
    debugger;
    var field = new Field(param);
    field.save(function(err, field) {
      debugger;
      if (err) { return reject(err); }
      Appp.update({_id: appp._id}, {$addToSet: {fields: field._id}}, function(err, appp) {
          if (err) {return reject(err);}
          return resolve(field);
      });
    })
  })

}     
