var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var property = mongoose.model('Property');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  
var Property = mongoose.model('Property');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; //Have also tried Schema.Types.ObjectId, mongoose.ObjectId

//property Management
router.get('/properties/:workspace_id', auth, function(req, res, next) {
  debugger;
  Property.find({workspace: req.params.workspace_id}, function(err, properties) {
    if (err) { return next(err); }
    return res.json(properties);
  })
});
router.get('/property/:id', auth, function(req, res, next) {
  Property.findById(req.params.id, function(err, property) {
    if (err) { return next(err); }
    if (!property) {return res.status(404);}
    return res.json(property);
  })
});
router.post('/properties', auth, function(req, res, next) {
  var property = new Property(req.body);
  property.save(function(err, property) {
    if (err) { return next(err); }
    Workspace.update({_id: property.workspace}, {$addToSet: {properties: property._id}}, function(err, workspace) {
      if (err) { return next(err); }
      return res.json(property);
    });     
  });
});
router.put('/property/:id', auth, function(req, res, next) {
  Property.update({_id: req.params.id}, req.body, function(err, updated) {
    if (err) { return next(err); }
    return res.json(updated);
  });
});
router.delete('/property/:id', auth, function(req, res, next) {
  Property.remove({_id: req.params.id}, function(err, removed) {
    if (err) { return next(err); }
    return res.json(removed);
  });
});


module.exports = router;
