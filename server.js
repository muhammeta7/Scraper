// Dependencies 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

// morgan and body-parser 
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static('public'));


// Database Configuration
mongoose.connect('mongodb://localhost/MongoScrape');
var db = mongoose.connection;

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
var Comments = require('./models/Comments.js');

// Routes
// ===============================================================

