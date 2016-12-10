//dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');

//Require models
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');


// Index Route
router.get('/', function (req, res) {
  res.redirect("/scrape");
});

// Articles Rendering 
router.get('/articles', function(req, res) {
  // MongoDB query for all article entries sorting by newest and populates comments associated with the article
    Article.find().sort({_id: -1})
    .populate('comments')
    // Send to handlebars
    .exec(function(err, doc){
      if(err){
        console.log(err);
      }
      else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
      }
    });
});

// Mongoose Scrape route
router.get('/scrape', function(req, res) {
    // first, we grab the body of the html with request
  request('http://www.nytimes.com/section/sports', function(error, response, html) {
    // then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Error Handler to prevent duplicates
    var titlesArray = [];
    // now, we grab every h2 within an article tag, and do the following:
    $('.story-body').each(function(i, element) {
        var result = {};
        // add the text and href of every link, 
        // and save them as properties of the result obj
        result.title = $(this).children('h2').children('a').text().trim();
       // Collect the Article Link (contained within the "a" tag of the "h2"  of "this")
        result.link = $(this).children('h2').children('a').attr('href');
        // Collect article summary
        result.summary = $(this).children('.summary').text().trim();
        // Error handling to ensure there are no empty scrapes
        if(result.title !== "" &&  result.summary !== ""){
          // Due to async, Mongoose does not catch duplicates
          if(titlesArray.indexOf(result.title) == -1){
            titlesArray.push(result.title);
            // Only adds the entry to the database if is not already there
            Article.count({ title: result.title}, function (err, test){
              if(test == 0){
                var entry = new Article (result);

                // Save the entry to MongoDB
                entry.save(function(err, doc) {
                  if (err) {
                    console.log(err);
                  } 
                  // or log the doc that was saved to the DB
                  else {
                    console.log(doc);
                  }
                });

              }
              // Log that scrape is working, content is already in the Database
              else{
                console.log('Repeated DB Content. Not saved to DB.')
              }

            });
        }
        // Log that scrape is working, content is missing parts
        else{
          console.log('Repeat Content. Not Saved to DB.')
        }

      }
      // Log that scrape is working, content is missing parts
      else{
        console.log('Empty Content. Not Saved to DB.')
      }
    });
    // Redirect to the Articles Page, done at the end of request 
    res.redirect("/articles");
  });

});


// Add a comment route
router.post('/add/comment/:id', function(req, res) {

  // Collect id, author, and comment content
  var articleId = req.params.id;
  var author = req.body.name;
  var comment = req.body.comment;

  // "result" object has same key-value pairs as Comment model
  var result = {
    author: author,
    content: comment
  } 
  // Using the Comment model, create a new comment entry
  var entry = new Comment (result);

  // Save the entry to the database
  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    } 
    // Or, relate the comment to the article
    else {
      // Push the new Comment to the list of comments in the article
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // Send Success Header
          res.sendStatus(200);
        }
      });
    }
  });

});

// Delete Comment Route
router.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;
  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {  
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.sendStatus(200);
    }
  });

});


module.exports = router;