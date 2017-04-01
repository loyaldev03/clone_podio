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

//Item Management
router.get('/items', auth, function(req, res, next) {
  Item.find({}, function(err, items) {
    if (err) { return next(err); }
    return res.json(items);
  })
});
router.get('/item/:id', auth, function(req, res, next) {
  Item.findById(req.params.id, function(err, item) {
    if (err) { return next(err); }
    if (!item) {return res.status(404);}
    return res.json(item);
  })
});
router.post('/items', auth, function(req, res, next) {
  var item = new Item({appp: req.body.appp})
  fields_list = [];
  for (field in req.body) {
    if (field != "appp") { 
      item.fields.push(field);
    }
  }
  item.save(function(err, item) {
    if (err) { return next(err); }
    for (field in req.body) {
      if (field != "appp") { 
        fields_list.push(createValue(item._id, field, req.body[field]));
      }
    }
    Promise.all(fields_list)
    .then(function(_res) {
      return res.json(item);
    })
    .catch(function(err) {
      return next(err);
    })
  })
});
var createValue = function(item_id, field_id, _value) {
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
router.put('/item/:id', auth, function(req, res, next) {
  Item.update({_id: req.params.id}, req.body, function(err, item) {
    if (err) { return next(err); }
    return res.json(item);
  });
});
router.delete('/item/:id', auth, function(req, res, next) {
  Item.remove({_id: req.params.id}, function(err, item) {
    if (err) { return next(err); }
    return res.json(item);
  });
});
module.exports = router;
