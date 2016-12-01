//Using only the node.js


// //Get the http and File system modules
// var http = require('http'),
// 	fs = require('fs');
// //Creating server with the http module
// http.createServer(function(req, res) {
// 	//write to server set configuration for response
// 	res.writeHead(200, {
// 		'Content-Type' : 'text/html',
// 		'Acces-Control-Allow-Origin' : '*'
// 	});

// 	// Grab the index html file using FS
// 	var readStream = fs.createReadStream(__dirname +'/index.html');

// 	//semd the index.html file to user
// 	readStream.pipe(res);
// }).listen(1337)

// //tell whats happening 
// console.log('Up at http://localhost:1337');

// Express version 

var express = require('express');
var app =  express();
var path = require('path');

//Sending HTML to the home page
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});


// get an instance of the router
var adminRouter = express.Router();

// Middleware
adminRouter.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});


// admin main page (http://localhost:1337/admin)
adminRouter.get('/', function(req,res) {
	res.send('I am the dashboard');
});

//users page
adminRouter.get('/users', function(req, res){
	res.send('All the users!');
});

//post page (http://localhost:1337/admin/posts)
adminRouter.get('/posts', function(req, res) {
	res.send('I show all the posts!');
});

//applying the routes to application
app.use('/admin', adminRouter);

//route with paraneters
adminRouter.get('/users/:name', function(req, res){
	res.send('Hello ' + req.params.name + "!");
});

adminRouter.param('name', function(req, res, next, name){
	console.log("doing name valdations on " + name);
	req.name = name;
	next();
});

adminRouter.get('/hello/:name', function(req, res){
	res.send('Hello ' + req.name + "!");
});


app.route('/login')
	
	.get(function(req, res){
		res.send('This is the login form')
	})

	.post(function(req, res){
		console.log('processing');
		res.send('Processing the login from');
	})
//grab the packages
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testDB');

// Start listem the server
app.listen(1337);
console.log('1337 port is on');