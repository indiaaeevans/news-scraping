// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Requiring our Comment and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/natgeodb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======
// Scrape data from site and place it into the db
app.get("/scrape", function(req, res) {
    // Make a request for environmental articles on national geographic's website
    request("http://www.nationalgeographic.com/search/?q=environment", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with an "article" class
    $("article").each(function(i, element) {

        // Save an empty result object
        var result = {};

        // get title, link, and description from each article
        result.title = $(element).find("div").find("header").find("h3").find("a").text();
        result.link = $(element).find("div").find("header").find("h3").find("a").attr("href");
        result.description = $(element).find("div").find("p").text();

        // Using our Article model, create a new entry
        var entry = new Article(result);

        // save the new entry to the db
        entry.save(function(err, doc) {
        // Log any errors
        if (err) console.log(err);
        // Or log the doc
        else console.log(doc);
      });
    });
  });
  // redirect to home after scraping
  res.redirect("/");
});

// get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) res.send(error);
        else res.send(doc);
    });
});

// get only the saved articles
app.get("/articles/saved", function(req, res) {
    // Find just one result in the collection using the id in the url
    Article.find({ "saved": true }).exec(function(error, doc) {
        // Send any errors to the browser
        if (error) res.send(error);
        // responds with the saved articles
        else res.send(doc);
    });
});

// Load the saved articles page
app.get('/saved', function(req, res) {
    res.sendFile(path.join(__dirname, "./public/saved.html"));
});

// Get an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
 Article.findOne({
    "_id": req.params.id
  // and run the populate method with "comments",
  }).populate("comments")
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) res.send(error);
      // responds with the article with the comments included
      else res.send(doc);
    });
});

// Update article's "saved" boolean to save it
app.put("/articles/saved/:id", function(req, res) { 
    var query = { "_id": req.params.id };
    Article.findOneAndUpdate(query, { saved: true }, 
        function (err, article) {  
            // Handle any possible database errors
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(article);
            }
        }
    );
});

// Create a new comment
app.post("/articles/:id", function(req, res) {
  // save the new comment that gets posted to the collection
  var newComment = new Comment(req.body);
  newComment.save(function(error, doc) {
    if (error) {
      res.send(error);
    } else {
      // then find an article from the req.params.id
      // and update it's "comments" property with the _id of the new comment      
      Article.findOneAndUpdate({"_id": req.params.id}, {"comments": doc_id})   
      .exec(function(error, doc) {
          // Send any errors to the browser
          if (error) res.send(error);
          // responds with the article with the comments included
          else res.send(doc);
      });
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
