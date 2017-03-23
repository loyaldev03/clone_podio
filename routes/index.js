var express = require('express');
var router = express.Router();
var conf = require('../config/config');
var socketio = require('socket.io');
var request = require('request');
var graph = require('fbgraph');
var qs = require('querystring');
graph.setAppSecret(conf.fb.appSecret);

var access_token = "";
var user_id = "";

var authUrl = graph.getOauthUrl({
    "client_id":     conf.fb.appId,
    "redirect_uri":  conf.fb.redirect_uri
});

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Account = mongoose.model('Account');
var Page = mongoose.model('Page');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var TweetAccount = mongoose.model('TweetAccount');
var Tweet = mongoose.model('Tweet');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
module.exports = router;
