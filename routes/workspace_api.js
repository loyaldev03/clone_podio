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

//Workspace Management
router.get('/workspaces', auth, function(req, res, next) {
  Workspace.find({}, function(err, workspaces) {
    if (err) { return next(err); }
    return res.json(workspaces);
  })
});
router.get('/workspace/:id', auth, function(req, res, next) {
  Workspace.findById(req.params.id, function(err, workspace) {
    if (err) { return next(err); }
    if (!workspace) {return res.status(404);}
    return res.json(workspace);
  })
});
router.post('/workspaces', auth, function(req, res, next) {
  var workspace = new Workspace(req.body);
  workspace.save(function(err, workspace) {
    if (err) { return next(err); }
    User.update({_id: workspace.user}, {$addToSet: {workspaces: workspace._id}}, function(err, user) {
      if (err) { return next(err); }
      return res.json(workspace);
    });     
  });
});
router.put('/workspace/:id', auth, function(req, res, next) {
  Workspace.update({_id: req.params.id}, req.body, function(err, workspace) {
    if (err) { return next(err); }
    return res.json(workspace);
  });
});
router.delete('/workspace/:id', auth, function(req, res, next) {
  Workspace.remove({_id: req.params.id}, function(err, workspace) {
    if (err) { return next(err); }
    return res.json(workspace);
  });
});

module.exports = router;
