var express = require('express');
var router = express.Router();
var conf = require('../config/config');
var socketio = require('socket.io');
var request = require('request');
var graph = require('fbgraph');
var qs = require('querystring');
graph.setAppSecret(conf.fb.appSecret);
var facebook_instance = require('../controllers/manage_facebook');
var twitter_instance = require('../controllers/manage_twitter');

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

router.post('/auth/facebook', function(req, res, next) {
  graph.authorize({
      "client_id":      conf.fb.appId
    , "redirect_uri":   req.body.redirectUri
    , "client_secret":  conf.fb.appSecret
    , "code":           req.body.code
  }, function (err, facebookRes) {
  	if (err) {
  		return next(err);
  	}
    graph.extendAccessToken({
        "client_id":      conf.fb.appId
      , "client_secret":  conf.fb.appSecret
    }, function (err, facebookRes) {
			if (err) {
				return next(err);
			}
			facebook_instance.completeInfo(facebookRes.access_token)
			.then(function(account) {
				return res.json(account);
			})
			.catch(function(err) {
				return res.json(err);
			});
    });
  });
});

router.get('/api/v1/accounts', function(req, res, next) {
	Account.find({}, function(err, accounts) {
		if (err) {
			return next(err);
		}
		return res.json(accounts);
	});
});

router.get('/api/v1/account/:account_id', function(req, res, next) {
	Account.findById(req.params.account_id, function(err, account) {
		if (err) {
			return next(err);
		}
		account.populate("pages", function(err, account) {
			if (err) {
				return next(err);
			}
			return res.json(account);
		});
	});
});

router.get('/api/v1/full_page/:page_id', function(req, res, next) {
	Page.findById(req.params.page_id, function(err, page) {
		if (err) {
			return next(err);
		}
		if (page)
		{
			page.populate({
				path: 'posts',
	    	model: 'Post',
				populate: {
					path: 'comments',
					model: 'Comment',
					populate: {
						path: 'mentions',
						model: 'Mention'
					}
				}
			},function(err, page) {
					if (err) {
						return next(err);
					}
					return res.json(page);
				}
			);
		} else {
			return res.json({});
		}
	});
});

router.get('/api/v1/page/:page_id', function(req, res, next) {
	Page.findById(req.params.page_id, function(err, page) {
		if (err) {
			return next(err);
		}
		page.populate("posts", function(err, page) {
			if (err) {
				return next(err);
			}
			return res.json(page);
		});
	});
});

router.get('/api/v1/post/:post_id', function(req, res, next) {
	Post.findById(req.params.post_id, function(err, post) {
		if (err) {
			return next(err);
		}
		post.populate("comments", function(err, post) {
			if (err) {
				return next(err);
			}
			return res.json(post);
		});
	});
});

router.get('/api/v1/comment/:comment_id', function(req, res, next) {
	Comment.findById(req.params.comment_id, function(err, comment) {
		if (err) {
			return next(err);
		}
		comment.populate("mentions", function(err, comment) {
			if (err) {
				return next(err);
			}
			return res.json(comment);
		});
	});
});

router.post('/api/v1/mentions', function(req, res, next) {
	var comment_id = req.body.comment_id;
	var msg = req.body.msg;
	Comment.findById(comment_id, function(err, comment) {
		if (err) {
			return next(err);
		}
		comment.populate({
			path: 'post',
    	model: 'Post',
			populate: {
				path: 'page',
				model: 'Page',
				populate: {
					path: 'account',
					model: 'Account'
				}
			}
		},function(err, comment) {
				if (err) {
					return next(err);
				}
				account = comment.post.page.account;
				facebook_instance.addMention(account.access_token, comment, msg)
						.then(function(mention) {
							return res.json(mention);
						})
						.catch(function(err) {
							return next(err);
						});				
			}
		);
	});
});

router.post('/api/v1/comments', function(req, res, next) {
	var post_id = req.body.post_id;
	var msg = req.body.msg;
	Post.findById(post_id, function(err, post) {
		if (err) {
			return next(err);
		}
		post.populate({
			path: 'page',
			model: 'Page',
			populate: {
				path: 'account',
				model: 'Account'
			}
		},function(err, post) {
				if (err) {
					return next(err);
				}
				account = post.page.account;
				facebook_instance.addComment(account.access_token, post, msg)
						.then(function(comment) {
							return res.json(comment);
						})
						.catch(function(err) {
							return next(err);
						});				
			}
		);
	});
});

router.get('/facebook/webhook_for_user', function(req, res) {
  if ( req.param('hub.mode') == 'subscribe' && req.param('hub.verify_token') == 'token') {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

router.post('/facebook/webhook_for_user', function(req, res) {
  console.log('Facebook request body:');

  if (req.isXHub) {
    console.log('request header X-Hub-Signature found, validating');
    if (req.isXHubValid()) {
      console.log('request header X-Hub-Signature validated');
      res.send('Verified!\n');
    }
  }
  else {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.send('Failed to verify!\n');
    // recommend sending 401 status in production for non-validated signatures
    // res.sendStatus(401);
  }
  // Process the Facebook updates here
  res.sendStatus(200);
})

router.get('/facebook/webhook_for_page', function(req, res) {
  if ( req.param('hub.mode') == 'subscribe' && req.param('hub.verify_token') == conf.fb.verify_token) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

router.post('/facebook/webhook_for_page', function(req, res) {
  var page_id = req.body.entry[0].id;
  facebook_instance.updateSpecificPage(page_id)
  .then(function(page) {
  	var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
		socketio.sockets.emit('page.updated', page_id); // emit an event for all connected clients
  	return res.sendStatus(200);
  })
  .catch(function(err) {
  	return res.sendStatus(500);
  });
})


router.post('/auth/twitter', function(req, res, next) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';

  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: conf.twit.consumerKey,
      consumer_secret: conf.twit.consumerSecret,
      callback: req.body.redirectUri
    };
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
    	if (err) {
    		res.status(400);
    	}
      var oauthToken = qs.parse(body);
      res.send(oauthToken);
    });
  } else {
    var accessTokenOauth = {
      consumer_key: conf.twit.consumerKey,
      consumer_secret: conf.twit.consumerSecret,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      var access_token = qs.parse(accessToken);
			twitter_instance.completeInfo(access_token, req.app.get('socketio'))
			.then(function(tweets) {
				return res.json(tweets);
			}).catch(function(err) {
				return res.json(err);
			})
    });
  }
});

router.get('/api/v1/tweet_accounts', function(req, res, next) {
	TweetAccount.find({}, function(err, tweet_accounts) {
		if (err) {
			return next(err);
		}
		return res.send(tweet_accounts);
	})
})

router.get('/api/v1/tweet_account/:account_id', function(req, res, next) {
	TweetAccount.findById(req.params.account_id, function(err, account) {
		if (err) {
			return next(err);
		}
		account.populate({
			path: 'tweets',
    	model: 'Tweet',

		},function(err, account) {
			if (err) {
				return next(err);
			}
			return res.json(account);
		});
	})
})

router.post('/api/v1/tweets', function(req, res, next) {
	var tweet = req.body.tweet;
	var text = req.body.text;
	TweetAccount.findOne({tweets: tweet._id}, function(err, account) {
		if (err) {
			return next(err);
		}
		var Twitter = require('twitter');
		var twitter_client = new Twitter({
	    consumer_key: conf.twit.consumerKey,
	    consumer_secret: conf.twit.consumerSecret,
		  access_token_key: account.access_token_key,
		  access_token_secret: account.access_token_secret
		});  			
		twitter_client.post('statuses/update', {status: text, in_reply_to_status_id: tweet.id_str }, function(err, tweet, response) {
		  if (err) {
		    return next(err);
		  }
		  return res.json(tweet);
		});
	})
	
})

module.exports = router;
