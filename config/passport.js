var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('config');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('config');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

//import controllers
var workspace_controller = require('../controllers/workspace.controller');
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	debugger;
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	debugger;
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	debugger;
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.'});
			}
			return done(null, user);
		});
	}
));

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.'});
			}
			return done(null, user);
		});
	}
));


passport.use('facebook', new FacebookStrategy({
    clientID        : config.get('Facebook.appID'),
    clientSecret    : config.get('Facebook.appSecret'),
    callbackURL     : config.get('Facebook.callbackURL'),
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
},
	// facebook will send back the tokens and profile
  function(token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
          // find the user in the database based on their facebook id
          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err) {
                return done(err);
              }
              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user found with that facebook id, create them
                  var newUser = new User();
                  // set all of the facebook information in our user model
                  var facebook = {};
                  facebook.id    = profile.id; // set the users facebook id                   
                  facebook.token = token; // we will save the token that facebook provides to the user                    
                  facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                  facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.facebook = facebook;
                  newUser.activated = true;
                  // save our user to the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      // if successful, create default workspace and return user
											workspace_controller.createDefaultWorkspace(newUser)
													.then(function(workspace){
			                      return done(null, newUser);
													})
													.catch(function(err) {
														return done(err);
													})                      
                  });
              }

          });
      });

  }
  function(token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
          // find the user in the database based on their facebook id
          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err) {
                return done(err);
              }
              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user found with that facebook id, create them
                  var newUser = new User();
                  // set all of the facebook information in our user model
                  var facebook = {};
                  facebook.id    = profile.id; // set the users facebook id                   
                  facebook.token = token; // we will save the token that facebook provides to the user                    
                  facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                  facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.facebook = facebook;
                  newUser.activated = true;
                  // save our user to the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      // if successful, create default workspace and return user
											workspace_controller.createDefaultWorkspace(newUser)
													.then(function(workspace){
			                      return done(null, newUser);
													})
													.catch(function(err) {
														return done(err);
													})                      
                  });
              }

          });
      });

  }
							      
));

passport.use(new TwitterStrategy({
    consumerKey     : config.get('Twitter.consumerKey'),
    consumerSecret  : config.get('Twitter.consumerSecret'),
    callbackURL     : config.get('Twitter.callbackURL')
},
function(token, tokenSecret, profile, done) {

    // make the code asynchronous
// User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user, create them
                var newUser = new User();

                // set all of the user data that we need
                var twitter = {};
                twitter.id          = profile.id;
                twitter.token       = token;
                twitter.username    = profile.username;
                twitter.displayName = profile.displayName;
                newUser.twitter = twitter;
                newUser.activated = true;
                // save our user into the database
                newUser.save(function(err) {
                    if (err)
                        throw err;
										workspace_controller.createDefaultWorkspace(newUser)
												.then(function(workspace){
		                      return done(null, newUser);
												})
												.catch(function(err) {
													return done(err);
												})                       
                });
            }
        });

});

}));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('config');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

//import controllers
var workspace_controller = require('../controllers/workspace.controller');
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	debugger;
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	debugger;
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.'});
			}
			return done(null, user);
		});
	}
));

passport.use('facebook', new FacebookStrategy({
    clientID        : config.get('Facebook.appID'),
    clientSecret    : config.get('Facebook.appSecret'),
    callbackURL     : config.get('Facebook.callbackURL'),
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
},
	// facebook will send back the tokens and profile
  function(token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
          // find the user in the database based on their facebook id
          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err) {
                return done(err);
              }
              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user found with that facebook id, create them
                  var newUser = new User();
                  // set all of the facebook information in our user model
                  var facebook = {};
                  facebook.id    = profile.id; // set the users facebook id                   
                  facebook.token = token; // we will save the token that facebook provides to the user                    
                  facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                  facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.facebook = facebook;
                  newUser.activated = true;
                  // save our user to the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      // if successful, create default workspace and return user
											workspace_controller.createDefaultWorkspace(newUser)
													.then(function(workspace){
			                      return done(null, newUser);
													})
													.catch(function(err) {
														return done(err);
													})                      
                  });
              }

          });
      });

  }
));

passport.use(new TwitterStrategy({
    consumerKey     : config.get('Twitter.consumerKey'),
    consumerSecret  : config.get('Twitter.consumerSecret'),
    callbackURL     : config.get('Twitter.callbackURL')
},
function(token, tokenSecret, profile, done) {

    // make the code asynchronous
// User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user, create them
                var newUser = new User();

                // set all of the user data that we need
                var twitter = {};
                twitter.id          = profile.id;
                twitter.token       = token;
                twitter.username    = profile.username;
                twitter.displayName = profile.displayName;
                newUser.twitter = twitter;
                newUser.activated = true;
                // save our user into the database
                newUser.save(function(err) {
                    if (err)
                        throw err;
										workspace_controller.createDefaultWorkspace(newUser)
												.then(function(workspace){
		                      return done(null, newUser);
												})
												.catch(function(err) {
													return done(err);
												})                       
                });
            }
        });

});

}));	
