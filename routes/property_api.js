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
var uuid = require('uuid'); // https://github.com/defunctzombie/node-uuid
var multiparty = require('multiparty'); // https://github.com/andrewrk/node-multiparty

//property Management
router.get('/properties/:workspace_id', auth, function(req, res, next) {
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
  debugger;
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

router.post('/property/file_upload_for_property', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var file = files.file[0];
    var s3 = require('s3'); // https://github.com/andrewrk/node-s3-client
    var fs = require('fs');
    var AWS = require('aws-sdk');
    AWS.config.update({
     accessKeyId: 'AKIAJCE32QOCEWH2HRNA', 
     secretAccessKey: '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' 
    });
    fs.readFile(file.path, function (err, data) {
      if (err) { throw err; }

      var base64data = new Buffer(data, 'binary');
      var extension = file.path.substring(file.path.lastIndexOf('.'));

      var s3 = new AWS.S3();

      // s3.putObject({
      //   Bucket: 'linkabee',
      //   Key: "properties/" + uuid.v4() + extension,
      //   Body: base64data,
      //   ACL: 'public-read'
      // },function (err, resp) {
      //   if (err) {
      //     return next(err);
      //   }
      //   debugger;
      //   return res.json(resp);
      // });
      s3.upload({
        Bucket: "linkabee",
        Key: "properties/" + uuid.v4() + extension,
        Body: base64data,
        ACL: 'public-read'
      }, function(err, data) {
        if (err) {
          return next(err);
        }
        debugger;
        return res.json(data);
      });
    });
  });  
})

module.exports = router;
