var mongoose = require('mongoose');
var User = mongoose.model('User');
var TweetAccount = mongoose.model('TweetAccount');
var Tweet = mongoose.model('Tweet');
var conf = require('../config/config');
var promise = require('promise');
var twitter = require('twitter');
var request = require('request');
var app = require('../app.js');
var socketio = require('socket.io');

var twitter_instance = {};

twitter_instance.completeInfo = function(access_token, socketio) {
	return new Promise(function(resolve, reject) {
		twitter_instance.createAccountAndTweets(access_token, socketio)
		.then(function(account) {
			return resolve(account);
		}).catch(function(err) {
			return reject(err);
		});
	});
}

twitter_instance.createUser = function(twttier_client) {

}

twitter_instance.createAccountAndTweets = function(access_token, socketio) {
	return new Promise(function(resolve, reject) {
	  var Twitter = require('twitter');
		var twitter_client = new Twitter({
	    consumer_key: conf.twit.consumerKey,
	    consumer_secret: conf.twit.consumerSecret,
		  access_token_key: access_token.oauth_token,
		  access_token_secret: access_token.oauth_token_secret
		});  	
		var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
	  var profileOauth = {
	    consumer_key: conf.twit.consumerKey,
	    consumer_secret: conf.twit.consumerSecret,
	    token: access_token.oauth_token,
	    token_secret: access_token.oauth_token_secret,
	  };

	  request.get({
	    url: profileUrl,
	    qs: { include_email: true },
	    oauth: profileOauth,
	    json: true
	  }, function(err, response, profile) {
	  	if (err) {
	  		return reject(err);
	  	}

	  	TweetAccount.findOne({id: profile.id}, function(err, account) {
	  		if (err) {
	  			return reject(err);
	  		}
	  		if (account) {
	  			return reject({"error": "account already exists"});
	  		}
				twitter_client.stream('statuses/filter', {follow: profile.id_str},  function(stream) {
				  stream.on('data', function(tweet_info) {
				    TweetAccount.findOne({id: profile.id}, function(err, account) {
				    	if (!err) {
								var tweet = Tweet({
									id: tweet_info.id,
									id_str: tweet_info.id_str,
									in_reply_to_screen_name: tweet_info.in_reply_to_screen_name,
									in_reply_to_status_id: tweet_info.in_reply_to_status_id,
									in_reply_to_status_id_str: tweet_info.in_reply_to_status_id_str,
									in_reply_to_user_id: tweet_info.in_reply_to_user_id,
									in_reply_to_user_id_str: tweet_info.in_reply_to_user_id_str,
									text: tweet_info.text,
									account: account,
									created_at: new Date(tweet_info.created_at)
								});
								tweet.save(function(err, tweet) {

									if (!err) {
										TweetAccount.update({_id: account._id}, {$addToSet: {tweets: tweet._id}}, function(err, account) {
											socketio.sockets.emit('tweet.updated', tweet_info.user.id); // emit an event for all connected clients
										});
										var user_info = tweet_info.user;
										User.findOne({id: user_info.id}, function(err, user) {
											if (!user) {
												var user = User({
													id: user_info.id,
													id_str: user_info.id_str,
													name: user_info.name,
													screen_name: user_info.screen_name,
													description: user_info.description,
													url: user_info.url,
													followers_count: user_info.followers_count,
													friends_count: user_info.friends_count,
													listed_count: user_info.listed_count,
													created_at: new Date(user_info.created_at),
													type: 'twitter',
													image: user_info.profile_image_url,
													address: user_info.location,
												});
												user.save(function(err, user) {
													if (!err) {
														Tweet.update({_id: tweet._id}, {user: user._id}, function(err, tweet) {															
															if (err) {
															}
														})
													}
												})																		
											}
											if (user) {
												Tweet.update({_id: tweet._id}, {user: user._id}, function(err, tweet) {															
													if (err) {
													}
												})
											}
										})
									}
								});				    		
				    	}
				    })
				  });

				  stream.on('error', function(error) {
				    console.log(error);
				  });
				});

	  		var account = TweetAccount({
	  			id: profile.id,
	  			id_str: profile.id_str,
	  			name: profile.name,
	  			screen_name: profile.screen_name,
	  			followers_count: profile.followers_count,
	  			friends_count: profile.friends_count,
	  			statuses_count: profile.statuses_count,
	  			access_token_key: access_token.oauth_token,
	  			access_token_secret: access_token.oauth_token_secret,
	  		})
	  		account.save(function(err, account) {
	  			if (err) {
	  				return reject(err);
	  			}

					twitter_client.get('statuses/user_timeline', {count: 100}, function(err, tweets, response) {
						if (err) {
							return reject(err);
						}
						for (var tweet_info of tweets) {
							var tweet = Tweet({
								id: tweet_info.id,
								id_str: tweet_info.id_str,
								in_reply_to_screen_name: tweet_info.in_reply_to_screen_name,
								in_reply_to_status_id: tweet_info.in_reply_to_status_id,
								in_reply_to_status_id_str: tweet_info.in_reply_to_status_id_str,
								in_reply_to_user_id: tweet_info.in_reply_to_user_id,
								in_reply_to_user_id_str: tweet_info.in_reply_to_user_id_str,
								text: tweet_info.text,
								account: account,
								created_at: new Date(tweet_info.created_at)
							});
							tweet.save(function(err, tweet) {
								if (err) {
									return reject(err);
								}
								TweetAccount.update({_id: account._id}, {$addToSet: {tweets: tweet._id}}, function(err, account) {
									if (err) {
										return reject(err);
									}
								});
								var user_info = tweet_info.user;
								User.findOne({id: user_info.id}, function(err, user) {
									if (!user) {
										var user = User({
											id: user_info.id,
											id_str: user_info.id_str,
											name: user_info.name,
											screen_name: user_info.screen_name,
											location: user_info.location,
											description: user_info.description,
											url: user_info.url,
											followers_count: user_info.followers_count,
											friends_count: user_info.friends_count,
											listed_count: user_info.listed_count,
											created_at: new Date(user_info.created_at),
											type: 'twitter',
											image: user_info.profile_image_url,
											address: user_info.location,
										});
										user.save(function(err, user) {
											if (err) {
											}
											if (!err) {
												Tweet.update({_id: tweet._id}, {user: user._id}, function(err, tweet) {															
													if (err) {
													}
												})
											}
										})																		
									}
									if (user) {
										Tweet.update({_id: tweet._id}, {user: user._id}, function(err, tweet) {															
											if (err) {
											}
										})
									}
								})
							});
						}
					});		
					return resolve(account);
	  		})
	  	})
	  });
	})
}

module.exports = twitter_instance;