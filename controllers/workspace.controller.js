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
var appp_controller = require('./appp.controller');
var field_controller = require('./field.controller');

var exports = module.exports; 

exports.createDefaultWorkspace = function(user){
  return new Promise(function(resolve, reject) {
    var username = "unnamed";
    if (user.username) {
      username = user.username;
    }
    else if (user.facebook) {
      username = user.facebook.name;
    }
    else {
      username = user.twitter.username;
    }
    var workspace = new Workspace({
      title: username+"'s leads",
      description: "default workspace",
      user: user._id
    });
    workspace.save(function(err, workspace) {
      if (err) {
        return reject(err);
      }
      User.update({_id: workspace.user}, {$addToSet: {workspaces: workspace._id}, default_workspace: workspace._id}, function(err, user) {
        if (err) {
          return reject(err);
        }
        appp_controller.createDefaultAppp(workspace)
        .then(function(appp) {
          return resolve(workspace);
        })
        .catch(function(err) {
          return reject(err);
        });  
      });
    });
  });
};