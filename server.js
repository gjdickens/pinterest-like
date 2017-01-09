import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from './src/middleware';

import https from 'https';
import http from 'http';
import BodyParser from 'body-parser';
import Mongoose from 'mongoose';
import Passport from 'passport';
import PassportLocal from 'passport-local';
import PassportTwitter from 'passport-twitter';
import session from 'express-session';
import Account from './src/models/account';
import Pic from './src/models/pic';

import socket from 'socket.io';


const app = express();
const server = http.Server(app);
const io = socket(server);

if(process.env.NODE_ENV === 'development') {
	const config = require('./webpack.config.dev');
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'src')));
}

else if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'dist')));
}

var port = process.env.PORT || 3000;


//configure MongoDB
const db = process.env.MONGOLAB_URI;

Mongoose.connect(db);

const conn = Mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('database connected');
});

//initialize passport and body parser
const LocalStrategy = PassportLocal.Strategy;
const TwitterStrategy = PassportTwitter.Strategy;
app.use(Passport.initialize());
app.use(Passport.session());
app.use(BodyParser.urlencoded({ extended: true}));
app.use(BodyParser.json());

const sessionSecret = process.env.SESSION_SECRET;
// Authentication configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: sessionSecret
}));

// passport Twitter Login config

const twitterClientId = process.env.TWITTER_CLIENT;
const twitterClientSecret = process.env.TWITTER_SECRET;
const twitterCallback = 'https://gj-pinterest-like.herokuapp.com/auth/twitter/callback';

// passport config
Passport.use(new LocalStrategy(Account.authenticate()));
Passport.serializeUser(Account.serializeUser());
Passport.deserializeUser(Account.deserializeUser());

Passport.use(new TwitterStrategy({

        consumerKey     : twitterClientId,
        consumerSecret  : twitterClientSecret,
        callbackURL     : twitterCallback
    },
		function(accessToken, refreshToken, profile, done) {

		    var searchQuery = {
		      username: profile.username
		    };

		    var updates = {
		      username: profile.username,
		      twitterId: profile.id
		    };

		    var options = {
		      upsert: true
		    };

		    // update the user if s/he exists or add a new user
		    Account.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
		      if(err) {
		        return done(err);
		      }
					else {
		        return done(null, user);
		      }
		    });

		  }

		));

//API routes
app.post('/register', (req, res) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
        }
        Passport.authenticate('local')(req, res, function () {
            res.json('register successful');
        });
    });
});

app.post('/login', Passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

app.get('/auth/twitter', Passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  Passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication

		res.redirect('/twitterLogin/' + req.user.username);
  });

app.get('/twitterLogin/:userId', function(req, res, next) {
	if (req.session.passport) {
		if (req.session.passport.user === req.params.userId) {
			next();
		}
	}
	else {
		res.redirect('/');
	}

  });


//Sockets

io.on('connection', function(socket) {
		Pic.find(function(err, pics) {
			if (err) {res.send(err)};
			if (pics.length > 0) {
				socket.emit('picData', pics);
			}
			else {
				socket.emit('picData', []);
			}
		});


		socket.on('newPic', function (data) {
			var pic = new Pic();
			pic.title = data.title;
			pic.image_url = data.image_url;
			pic.imgHeight = data.imgHeight;
			pic.timestamp = new Date();
			pic.username = data.username;

			pic.save(function(err, pic) {
				if (err) {console.log(err)};
				io.sockets.emit('newPicData', pic);
			});

		});

		socket.on('editPic', function (data) {
			Pic.findById(data._id, function(err, pic) {
        if (err) {res.send(err)}
        else {
          pic.title = data.title;
					pic.image_url = data.image_url;
					pic.imgHeight = data.imgHeight;
          pic.save(function(err, pic) {
            if (err) {console.log(err)};
            io.sockets.emit('editPicData', pic);
          });
        }

      });

		});

		socket.on('deletePic', function (data) {
			Pic.remove({
				_id: data._id
			}, function(err, pic) {
				if (err) {res.send(err)};
				io.sockets.emit('deletePicData', data);
		});
	});


});




app.get('*', middleware);

server.listen(port, '0.0.0.0', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.info('Listening at ' + port);
	}
});
