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

//controllers
var item_controller = require('../controllers/item.controller');

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
        fields_list.push(item_controller.createValue(item._id, field, req.body[field]));
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

//Properties for workspaces
router.post('/workspaces/:workspace_id/properties', auth, function(req, res, next) {
  Workspace.findById(req.params.workspace_id, function(err, workspace){
    var item = new Item({appp: workspace.default_appp})
      fields_list = [];
      for (field in req.body) {
        if (field != "appp") { 
          item.fields.push(field);
        }
      }
      item.save(function(err, item) {
        if (err) { return next(err); }
        Appp.update({_id: workspace.default_appp}, {$addToSet: {items: item._id}}, function(err, appp) {
          if (err) {
            return next(err);
          }
          for (field in req.body) {
            if (field != "appp") { 
              fields_list.push(item_controller.createValue(item._id, field, req.body[field]));
            }
          }
          Promise.all(fields_list)
          .then(function(_res) {
            return res.json(item);
          })
          .catch(function(err) {
            return next(err);
          })
        });
      })    
  })
})

router.put('/workspaces/:workspace_id/properties/:property_id', auth, function(req, res, next) {
  Workspace.findById(req.params.workspace_id, function(err, workspace){
    var item = new Item({appp: workspace.default_appp})
      fields_list = [];
      for (field in req.body) {
        if (field != "appp") { 
          item.fields.push(field);
        }
      }
      item.save(function(err, item) {
        if (err) { return next(err); }
        Appp.update({_id: workspace.default_appp}, {$addToSet: {items: item._id}}, function(err, appp) {
          if (err) {
            return next(err);
          }
          for (field in req.body) {
            if (field != "appp") { 
              fields_list.push(item_controller.createValue(item._id, field, req.body[field]));
            }
          }
          Promise.all(fields_list)
          .then(function(_res) {
            return res.json(item);
          })
          .catch(function(err) {
            return next(err);
          })
        });
      });    
  })
})

router.get('/workspaces/:workspace_id/properties', auth, function(req, res, next){
  Workspace.findById(req.params.workspace_id, function(err, workspace){
    if (err) {
      return next(err);
    }
    var appp_id = workspace.default_appp;
    item_controller.getItemsForAppp(appp_id)
    .then(function(items) {
      return res.json(items);
    })
    .catch(function(err) {
      return next(err);
    });
  })
})
module.exports = router;
