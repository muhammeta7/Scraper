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
    $('article .story-body').each(function(i, element) {
        var result = {};

        // add the text and href of every link, 
        // and save them as properties of the result obj
        result.title = $(this).children('header').children('h2').text() + '';
       // Collect the Article Link (contained within the "a" tag of the "h2" in the "header" of "this")
        result.link = 'http://www.nytimes.com/section/sports' + $(this).children('header').children('h2').children('a').attr('href');

        // Collect article summary
        result.summary = $(this).children('div').text().trim() + "";

        // Error handling to ensure there are no empty scrapes
        if(result.title !== "" &&  result.summary !== ""){

          // BUT we must also check within each scrape since the Onion has duplicate articles...
          // Due to async, moongoose will not save the articles fast enough for the duplicates within a scrape to be caught
          if(titlesArray.indexOf(result.title) == -1){

            // Push the saved item to our titlesArray to prevent duplicates thanks the the pesky Onion...
            titlesArray.push(result.title);

            // Only add the entry to the database if is not already there
            Article.count({ title: result.title}, function (err, test){

              // If the count is 0, then the entry is unique and should be saved
              if(test == 0){

                // Using the Article model, create a new entry (note that the "result" object has the exact same key-value pairs of the model)
                var entry = new Article (result);

                // Save the entry to MongoDB
                entry.save(function(err, doc) {
                  // log any errors
                  if (err) {
                    console.log(err);
                  } 
                  // or log the doc that was saved to the DB
                  else {
                    console.log(doc);
                  }
                });

              }
              // Log that scrape is working, just the content was already in the Database
              else{
                console.log('Repeated Database Content. Not saved to DB.')
              }

            });
        }
        // Log that scrape is working, just the content was missing parts
        else{
          console.log('Repeat Content. Not Saved to DB.')
        }

      }
      // Log that scrape is working, just the content was missing parts
      else{
        console.log('Empty Content. Not Saved to DB.')
      }

    });

    // Redirect to the Articles Page, done at the end of the request for proper scoping
    res.redirect("/articles");

  });

});


module.exports = router;