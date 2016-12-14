# :football: NY Times Sports Scraper :basketball:
A `Node.js` &amp; `MongoDB` webapp that web-scrapes sports articles from [The NY Times](http://www.nytimes.com/section/sports) and stores them into a database.  That info is then rendered onto the page and users can comment on the articles. Users can also delete unwanted comments.

# :computer: Get Started
Check out the app yourself: [Link](https://nytimes-sports.herokuapp.com/articles)

## Clone down the repo locally
If you want to clone the app down to your local machine do the following:
  1. Ensure that you have MongoDB set up on your laptop
    * Clone this repo to get set up [MongoDB](https://github.com/dannyvassallo/mongo_lesson).
    * Refer to 00_install_mongo.md for instructions
  2. Once you complete step 1, `cd` into this repo and run `npm install`.
  3. Then open another bash or terminal/gitbash window and run `mongod`
  4. Run the script with `node server.js`.
  5. Navigate to `localhost:3000` in your browser.
 
# :satellite: Technologies Used

Frontend: 'Materialize' and Font-Awesome is used as the styling framework. The templating for each article that is scraped to be render is done using 'handlebars'. For the comments sectionthe app uses 'jQuery' and 'AJAX' to make post requests.

Backend: App uses 'express' to serve routes and 'mongoose' to interact with a 'MongoDB' database. Webscraping is completed using the 'request' and 'cheerio' npm packages. Refer to controller.js file for all route and webscraping code.


## Screenshots
### The `/articles` route renders all the sports articles that were scraped and stored into the 'MongoDB'
![All Articles](/screenshots/articles.png)

###Click on the article icon to get short summary and access to link to article.
![Article Preview](/screenshots/preview.png)

### Click the Chat Bubble icon to add a comment via the `/add/comment/:id` post route
![Add Comment](/screenshots/comment.png)

#### Click the Thumbs up/down icon to view comments
![View Comments](/screenshots/view.png)

## Authors

* **Muhammet Aydin** - *Sequelize/Node/Express* - [Muhammet Aydin](https://github.com/muhammeta7)