// Dependencies 
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var express = require('express');
var app = express();
app.use(express.static(process.cwd() + '/public'));
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// morgan and body-parser 
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static('public'));


// Database Configuration
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sports_news');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongoose!')
});

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged into db db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful')
});

// We bring in the articles
var Article = require('./models/Article.js');
var Comments = require('./models/Comment.js');

// Routes
var routes = require('./controller/controller.js');
app.use('/', routes);

// Server and set up for Heroku app
var port = process.env.port || 3000;
app.listen(port, function() {
  console.log('App listening on PORT: ' + port);
});
