var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; //Have also tried Schema.Types.ObjectId, mongoose.ObjectId

//Get Fields for items
router.get('/fields/get_fields/:appp_id', auth, function(req, res, next) {
  Field.find({appp: req.params.appp_id}, function(err, fields){
    if (err) { return next(err); }
    return res.json(fields);
  })
})

//Get Property Fields for User
router.get('/fields/get_property_fields/:workspace_id', auth, function(req, res, next) {
  Workspace.findById(req.params.workspace_id, function(err, workspace) {
    Field.find({appp: workspace.default_appp}, function(err, fields){
      if (err) { return next(err); }
      return res.json(fields);
    })    
  })
})
router.get('/fields/get_property_fields_for_default_workspace', auth, function(req, res, next) {
  User.findById(req.payload._id, function(err, user){
    Workspace.findById(user.default_workspace, function(err, workspace) {
      Field.find({appp: workspace.default_appp}, function(err, fields){
        if (err) { return next(err); }
        return res.json(fields);
      })    
    })
  });
})
module.exports = router;
