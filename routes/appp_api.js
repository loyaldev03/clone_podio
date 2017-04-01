var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');  
var Workspace = mongoose.model('Workspace');  
var Appp = mongoose.model('Appp');  
var Item = mongoose.model('Item');  
var Field = mongoose.model('Field');  
var Value = mongoose.model('Value');  

//Import Controllers
var field_controller = require('../controllers/field.controller');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; //Have also tried Schema.Types.ObjectId, mongoose.ObjectId


//App Management
router.get('/appps', auth, function(req, res, next) {
  Appp.find({}, function(err, appps) {
    if (err) { return next(err); }
    return res.json(appps);
  })
});
router.get('/appp/:id', auth, function(req, res, next) {
  Appp.findById(req.params.id, function(err, appp) {
    if (err) { return next(err); }
    if (!appp) {return res.status(404);}
    return res.json(appp);
  })
});
router.post('/appps', auth, function(req, res, next) {
  var appp = new Appp(req.body);
  appp.save(function(err, appp) {
    if (err) { return next(err); }
    Workspace.update({_id: appp.workspace}, {$addToSet: {appps: appp._id}}, function(err, workspace) {
      if (err) { return next(err); }
      field_controller.createDefaultFields(appp)
      .then(function(_res) {
        return res.json(appp);
      })
      .catch(function(err) {
        return next(err);
      })
    });        
  });
});
router.put('/appp/:id', auth, function(req, res, next) {
  Appp.update({_id: req.params.id}, req.body, function(err, appp) {
    if (err) { return next(err); }
    return res.json(appp);
  });
});
router.delete('/appp/:id', auth, function(req, res, next) {
  Appp.remove({_id: req.params.id}, function(err, appp) {
    if (err) { return next(err); }
    return res.json(appp);
  });
});
var createDefaultFields = function(appp){
  var default_fields = [
    { name: "name", type: "text"},
    { name: "sex", type: "text"},
    { name: "birthday", type: "text"},
  ];
  return new Promise(function(resolve, reject){
    Promise.all(default_fields.map(function(field){ return createField(field, appp);}))
    .then(function(res) {
      console.log("--------all promises resolved-------------------");
      return resolve(res);
    })
    .catch(function(err) {
      console.log("----------------------defaults fields resolving error----------------", err)
      return reject(err);
    });    
  })
} 
var createField = function(param, appp) {
  return new Promise(function(resolve, reject){
    param["appp"] = appp._id;
    var field = new Field(param);
    field.save(function(err, field) {
      if (err) { return reject(err); }
      Appp.update({_id: appp._id}, {$addToSet: {fields: field._id}}, function(err, appp) {
          if (err) {return reject(err);}
          return resolve(field);
      });
    })
  })
}
module.exports = router;
