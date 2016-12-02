// Base setup
// ==================================================================



// Call the packages 
var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

var User = require('./models/user')

// Connect to DB

mongoose.connect('mongodb://aist:0000@ds113668.mlab.com:13668/testmlab');
// mongoose.connect('mongodb://localhost:27017/test');

// App configuration 
//use ody arser so we can grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//configure app to handle CORS request
app.use(function(req, res, next){
	res.setHeader('Acces-Controll-Allow-Origin', '*');
	res.setHeader('Acces-Controll-Allow-Methods', 'GET, POST');
	res.setHeader('Acces-Controll-Allow-Headers', 'X-Requested-With,content-type, \
Authorization');
	next();
});

// log all requests to the console

app.use(morgan('dev'));

//ROUTES FOR API
// ===================================================================



//Basic route for homepage
app.get('/', function(req, res){
	res.send('It\'s the home page!');
});

// get an instance of express route 

var apiRouter = express.Router();
// route for authenticating users
apiRouter.post('/authenticate', function(req, res){


	//find the user
	//selevt the name username and password explictly 
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if(err) throw err;

		//no user with that username was found
		if(!user){
			res.json({
				succes: false,
				message: 'Authentication failed. User not found. '
			})
		} else if (user) {
			//check if password mathes
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword){
				res.json({
					succes: false,
					message: 'Authentication failed, wrong password.'
				});
			} else {
				//if user was found and password is right
				//create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, secret, {
					expiresIn: 60*60*24 // expires in 24 hours
				});

				//return the information includig token as JSON
				res.json({
					succes: true,
					message: 'Token has succesfully greated!',
					token: token
				});
			}
		}
	});
});



//Middleware to use for requests
//route middleware to verify the token
apiRouter.use(function(req, res, next){
	//do logging
	console.log('Someone just came up to our app!');
	// This is where will be auth


	//verifying the token for user
	var token = req.body.token || req.param('token') || req.headers['x-access-toke\n'];

	//decode token
	if (token){
		// verifys secret and ches exp
		jwt.verify(token, secret, function(err, decoded){
			if (err) {
				return res.status(403).send({
					succes: false,
					message : 'Failed to authenticate token'
				});
			} else {
				//if eveythin is good, save to request for use in other routes
				req.decoded = decoded;

				next();
			}
		});
	} else {
		// if there no token
		//return an HTTP response of 403 (acces frobidden) dns error messge 
		return res.status(403).send({
			succes: false,
			message: 'No token provided'
		});
	}
	//next() used to be here
});	


//test route to make everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
	res.json({message: 'hooray! welcome to our API!'});
});

//more routes of API will happen here

//REGISTER OUR ROUTES =----
//All of our routes wil be prefixed with /api

app.use('/api', apiRouter);


//on route that end in /users
apiRouter.route('/users')

	// create a user
	.post(function(req, res) { 

		//create a new instance of the user model
		var user = new User();

		// set the users information (comes from request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		//save the users and check for errrors
		user.save(function(err){
			if(err) {
				//duplicate entry
				if(err.code == 11000 )
					return res.json({ succes: false, message : 'A user with that username already exists.' } );
				else 
					return res.send(err);
			}
						res.json({ message : 'User created!'});
		})
	})

// ON ROUTES TAHT END IN /USERS

	//create a user
	.get(function(req, res){
		User.find(function(err, users){
			if(err) res.send(err);

			//return the users
			res.json(users);
		});
	});

// on routes that end in /users/user_id
// ===========================================
apiRouter.route('/users/:user_id')

	//get the user with ID
	// Accesed at GET http://localhist:8080/api/users/:user_id
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err) res.send(err);

			//return the user
			res.json(user);
		
		})
	})

	//update user with ID
	//accesed at PUT http://localhost:8080/api/users/:user_id

	.put(function(req, res){
		// use our user model to find the user we want

		User.findById(req.params.user_id, function(err, user) {

			if(err) res.send(err);

			//update the users info inly if its new
			if(req.body.name) user.name = req.body.name;
			if(req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;

			//save the user
			user.save(function(err){
				if(err) res.send(err);

				// return a message
				res.json({ message: 'User succesfully updated'});
			});

		});
	})

//delete the user by ID
// accesed at DELETE http://localhost:8080/api/users/user_id
	.delete(function(req, res){
		User.remove({
			_id: req.params.user_id
		}, function(err, user){
			if 	(err) return res.send(err);


			res.json({ message : 'Succesully deleted' });
		});

	});



//Start the server 
// =========================

app.listen(port);
console.log('The server is up on port ' + port);

//api endpoint ti get user information
apiRouter.get('/me', function(req, res){
	res.send(req.decoded);
});

//json web token 
var jwt = require('jsonwebtoken');
var secret = 'hightmountain;'

