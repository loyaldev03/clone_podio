var mongoose = require('mongoose');
var User = mongoose.model('User');
var Account = mongoose.model('Account');
var Page = mongoose.model('Page');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Mention = mongoose.model('Mention');
var graph = require('fbgraph');
var conf = require('../config/config');
var promise = require('promise');

graph.setAppSecret(conf.fb.appSecret);

var facebook_instance = {};



facebook_instance.completeInfo = function(access_token) {
	return new Promise(function(resolve, reject){
		facebook_instance.createAccount(access_token)
		.then(function(res){
			return resolve(res);
		})
		.catch(function(err){
			return reject(err);
		});
	});
}

facebook_instance.createUser = function(access_token, user_id) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		User.findOne({"id": user_id}, function(err, user) {
			if (err) {
				return reject(err);
			}
			if (!user) {
				var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'location'];
				graph.get(user_id + "?fields=", fields.join(','), function(err, user_info){
					if (err) {
						return reject(err);
					}
					var user = User({
						id: user_info.id,
						email: user_info.email,
						first_name: user_info.first_name,
						last_name: user_info.last_name,
						image: user_info.link,
						name: user_info.name,
						address: user_info.location,
						type: 'facebook'
					});
					user.save(function(err, user) {
						if (err) {
							
						}
						return resolve(user);
					})
				})
			}
		});		
	})
}

facebook_instance.createAccount = function(access_token) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
		graph.get("me?fields=" + fields.join(','), function(err, res){
			if (err) {
				return reject(err);
			}
			Account.findOne({id: res.id}, function(err, account) {
				if (err) {
					return reject(err);
				}
				if (account) {
					return reject({"error":"account already exists"});
				}
				var account = Account({
					id: res.id,
					email: res.email,
					first_name: res.first_name,
					last_name: res.last_name,
					link: res.link,
					name: res.name,
					access_token: access_token
				});
				account.save(function(err, account) {
					if (err) {
						return reject(err);
					}
					// return facebook_instance.createPage(access_token, account);
					graph.get(res.id + "/accounts", function(err, res){
						if (err) {
							return reject(err);
						}
						var pages = res.data;
						var all_pages = [];
						for (var page_info of pages) {
							all_pages.push(facebook_instance.createPage(access_token, account, page_info));
						}
						Promise.all(all_pages).then(function(res){
							facebook_instance.setWebhook(account).then(function(res) {
								return resolve(account);
							}).catch(function(err) {
								return reject(err);
							})
						}).catch(function(err){
							return reject(err);
						});						
					});
				})
			})
		});		
	})
}

facebook_instance.createPage = function(access_token, account, page_info, next) {
	return new Promise(function(resolve, reject){
		graph.setAccessToken(access_token);
		var page = Page({
			id: page_info.id,
			access_token: page_info.access_token,
			category: page_info.category,
			name: page_info.name,
			account: account,
		});
		page.save(function(err, page){
			if (err) {
				return reject(err);
			}
			Account.update({_id: account._id}, {$addToSet: {pages: page._id}}, function(err, account) {			
				if (err) {
					return reject(err);
				}
				graph.get(page.id + "/posts", function(err, res){
					if (err) {
						return reject(err);
					}
					var posts = res.data;
					var all_posts = [];
					for (var post_info of posts) {
						all_posts.push(facebook_instance.createPost(access_token, page, post_info));
					}
					Promise.all(all_posts).then(function(res){
						return resolve(res);
					}).catch(function(err){
						return reject(err);
					});	
				});
			});
		});		
	})
};

facebook_instance.createPost = function(access_token, page, post_info, next) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		var fields = ['full_picture', 'id', 'message', 'created_time'];
		graph.get(post_info.id + "?fields=" + fields.join(','), function(err, post_info){
			if (err) {
				return reject(err);
			}
			var post = Post({
				id: post_info.id,
				message: post_info.message,
				created: new Date(post_info.created_time),
				full_picture: post_info.full_picture || "", 
				page: page
			});
			post.save(function(err, post) {
				if (err) {
					return reject(err);
				}
				Page.update({_id: page._id}, {$addToSet: {posts: post}}, function(err, page) {			
					if (err) {
						return reject(err);
					}
					graph.get(post.id + "/comments", function(err, res) {
						if (err) {
							return reject(err);
						}
						var comments = res.data;
						var all_comments = [];
						for (var comment_info of comments) {
							all_comments.push(facebook_instance.createComment(access_token, post, comment_info));
						}
						Promise.all(all_comments).then(function(res){
							return resolve(res);
						}).catch(function(err){
							return reject(err);
						});						
					})
				});
			})			
		})
	})
};

facebook_instance.createComment = function(access_token, post, comment_info, next) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		var comment = Comment({
			id: comment_info.id,
			from: comment_info.from,
			message: comment_info.message,
			created: new Date(comment_info.created_time),
			post: post
		});
		facebook_instance.createUser(access_token, comment_info.from.id)
		.then(function(user) {

		})
		.catch(function(err) {
			return reject(err);
		});
		comment.save(function(err, comment) {
			if (err) {
				return reject(err);
			}
			Post.update({_id: post._id}, {$addToSet: {comments: comment}}, function(err, post) {
				if (err) {
					return reject(err);
				}

				graph.get(comment.id + "/comments", function(err, res) {
					if (err) {
						return reject(err);
					}				

					var mentions = res.data;
					var all_mentions = [];
					for (var mention_info of mentions) {
						all_mentions.push(facebook_instance.createMention(access_token, comment, mention_info));
					}
					Promise.all(all_mentions).then(function(res){
						return resolve(res);
					}).catch(function(err){
						return reject(err);
					});		
				})
			})				
		})
	});
};

facebook_instance.createMention = function(access_token, comment, mention_info, next) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		var mention = Mention({
			id: mention_info.id,
			from: mention_info.from,
			message: mention_info.message,
			created: new Date(mention_info.created_time),
			comment: comment
		});
		facebook_instance.createUser(access_token, mention_info.from.id)
		.then(function(user) {

		})
		.catch(function(err) {
			return reject(err);
		});
		mention.save(function(err, mention) {
			if (err) {
				return reject(err);
			}
			// comment.mentions.push(mention);
			// comment.save(function(err, comment) {
			Comment.update({_id: comment._id}, {$addToSet:{mentions: mention}}, function(err, comment) {
				if (err) {
					return reject(err);
				}
				return resolve(mention);
			})
		})
	});
};

facebook_instance.addMention = function(access_token, comment, msg) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		graph.post(comment.id + "/comments", {message: msg}, function(err, res) {
			if (err) {
				return reject(err);
			}
			if (res.id) {
				graph.get(res.id, function(err, mention_info) {
					if (err) {
						return reject(err);
					}
					var mention = Mention({
						id: mention_info.id,
						from: mention_info.from,
						message: mention_info.message,
						created: new Date(mention_info.created_time),
						comment: comment
					});
					mention.save(function(err, mention) {
						if (err) {
							return reject(err);
						}
						comment.mentions.push(mention);
						comment.save(function(err, comment) {
							if (err) {
								return reject(err);
							}
							return resolve(mention);
						})
					})					
				});					
			}
		})
	});
};

facebook_instance.addComment = function(access_token, post, msg) {
	return new Promise(function(resolve, reject) {
		graph.setAccessToken(access_token);
		graph.post(post.id + "/comments", {message: msg}, function(err, res) {
			if (err) {
				return reject(err);
			}
			if (res.id) {
				graph.get(res.id, function(err, comment_info) {
					if (err) {
						return reject(err);
					}
					var comment = Comment({
						id: comment_info.id,
						from: comment_info.from,
						message: comment_info.message,
						created: new Date(comment_info.created_time),
						post: post
					});
					comment.save(function(err, comment) {
						if (err) {
							return reject(err);
						}
						post.comments.push(comment);
						post.save(function(err, post) {
							if (err) {
								return reject(err);
							}
							return resolve(comment);
						})
					})
				});					
			}
		})
	});
};

facebook_instance.setWebhook = function(account) {
	return new Promise(function(resolve, reject) {
		var access_token_params = {
			"client_id": conf.fb.appId,
			"client_secret": conf.fb.appSecret,
			"grant_type": "client_credentials"
		};
		graph.get('oauth/access_token', access_token_params, function(err, res) {
			if (err) {
				return reject(err);
			}
			var app_access_token = res.access_token;
			graph.setAccessToken(app_access_token);
			subscription_params_for_page = {
				"object": "page",
				"callback_url": conf.fb.callback_url_for_page,
				"fields": "feed",
				"verify_token": conf.fb.verify_token
			};
			graph.post(conf.fb.appId + "/subscriptions", subscription_params_for_page, function(err, res){
				if (err) {
					return reject(err);
				}
				Account.findById(account._id, function(err, account) {
					if (err) {
						return reject(err);
					}
					account.populate("pages", function(err, account) {
						if (err){
							return reject(err);
						}
						for (var page of account.pages) {
							graph.setAccessToken(page.access_token);
							graph.post(page.id + '/subscribed_apps', {}, function(err, res) {
								if (err) {
									return reject(err);
								}
							})
						}
						return resolve(res);
					})					
				})
			})
		})
	})
}

facebook_instance.updateSpecificPage = function(page_id) {
	return new Promise(function(resolve, reject) {
		Page.findOne({id: page_id}, function(err, page) {
			if (err) {
				return reject(err);
			}
			if (!page) {
				graph.get(page_id + "?fields=id,access_token,category,name", function(err, res) {
					if (err) {
						return reject(err);
					}
					var page = Page({
						id: page_info.id,
						access_token: page_info.access_token,
						category: page_info.category,
						name: page_info.name,
						account: account,
					});
					page.save(function(err, page){
						if (err) {
							return reject(err);
						}
						Account.update({_id: account._id}, {$addToSet: {pages: page._id}}, function(err, account) {			
							if (err) {
								return reject(err);
							}
							graph.get(page.id + "/posts", function(err, res){
								if (err) {
									return reject(err);
								}
								var posts = res.data;
								var all_posts = [];
								for (var post_info of posts) {
									all_posts.push(facebook_instance.createPost(access_token, page, post_info));
								}
								Promise.all(all_posts).then(function(res){
									return resolve(res);
								}).catch(function(err){
									return reject(err);
								});	
							});
						});
					});		
				})
			} else {
				facebook_instance.removeAllFromPage(page)
				.then(function(res) {	
					page.populate("account", function(err, page) {
						if (err) {
							return reject(err);
						}
						var access_token = page.account.access_token;
						graph.setAccessToken(access_token)
						graph.get(page.id + "/posts", function(err, res){
							if (err) {
								return reject(err);
							}
							var posts = res.data;
							var all_posts = [];
							for (var post_info of posts) {
								all_posts.push(facebook_instance.createPost(access_token, page, post_info));
							}
							Promise.all(all_posts).then(function(res){
								return resolve(page);
							}).catch(function(err){
								return reject(err);
							});	
						});															
					})
				})
			}
		})
	})
}

facebook_instance.removeAllFromPage = function(page) {
	return new Promise(function(resolve, reject) {
		Post.find({page: page._id}, function(err, posts) {
			if (err) {
				return reject(err);
			}
			var number_of_posts = posts.length;
			if (number_of_posts === 0) {
				return resolve(page);
			}
			for (var post of posts) {
				Comment.find({post: post._id}, function(err, comments) {
					if (err) {
						return reject(err);
					}
					for (var comment of comments) {
						Mention.remove({comment: comment._id}, function(err, res){
							if (err) {
								return reject(err);
							}
						})
						comment.remove(function(err, res) {
							if (err) {
								return reject(err);
							}
						})
					}
				})
				post.remove(function(err, res) {
					if (err) {
						return reject(err);
					}
					number_of_posts -= 1;
					if (number_of_posts === 0) {
						page.update({posts: []}, function(err, page) {
							if (err) {
								return reject(err);
							}
							return resolve(page);
						})
					}
				})
			}
		})
	})
}
module.exports = facebook_instance;