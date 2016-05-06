var express = require('express')
  , app = express()
  
var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip   = process.env.OPENSHIFT_NODEJS_IP;  

// Load dependencies
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Word = require('./server/schemas/wordSchema.js');
var random = require('mongoose-simple-random');

// Set default public directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Load connection to mongodb
var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);


/******************** ROUTES **********************/

// Handles play request
app.get('/play', function(req, res) {
  var filters = req.query;

  var min = (60*1000); // 1 minute
  var params = {}; // Clear filters
  var time_since = ""; // Clear filters

  // Filter: date
  if(filters.date) {
    switch(filters.date) {
      case '1': time_since = min*10080; break; // 1 week
      case '2': time_since = min*20160; break; // 2 weeks
      case '3': time_since = min*43800; break; // 1 month
      case '4': time_since = min*87600; break; // 2 months
      case '5': time_since = min*262800; break; // 6 months 
    }

    var now = new Date(); 
    var dateFilter = new Date(now.getTime() - time_since); 
    params = {date_created: {$gt:dateFilter}};
  }

  // Filter: type
  if(filters.type==true) {
    params.type = filters.type;
  }

  // Filter: revision list
  if(filters.revision_list) {
    params.revision_list = filters.revision_list;
  }

  // Get word object from mongo
  Word.findOneRandom(params, function(err, word) {
    if (err) {
      console.log(err);
    } else {
      console.log(word);
      res.json(word); 
    }
  });   
});


// Handles dictionary request
app.get('/getDictionary', function(req, res) { 
  Word.
  find({}).
  sort([['date_created', 'descending']]).
  limit(50).
  exec(function (err, words) {
    if (err) return console.error(err)
      res.json(words); // Send all words to Angular
  });
});


// Handles dictionary live search
app.get('/filterWords/:q', function(req, res) {
  var q = req.params.q;
  Word.find({eng: new RegExp(q, 'i')}, function(err, words) {
    if (err) return console.error(err);
      res.json(words); // Send word back to Angular as confirmation
  });
});


// Handles adding a new word 
app.post('/add', function(req, res) {  
    var word = new Word(req.body);
    word.save(function (err, word) {
      if (err) return console.error(err);
        res.json(word); // Send word back to Angular as confirmation
    });
});


// Handles word import
app.post('/import-words', function(req, res) {
    var words = req.body;
    words.forEach(function(w) {
        var word = new Word(w);
        word.save(function (err, word) {
          if (err) return console.error(err);
            console.log("successfully added!");
        });
    });
    
});


// Handles deleting a word
app.delete('/getDictionary/:id', function(req, res) {
    var id = req.params.id;
    Word.remove({ _id: id }, function(err) {
        if (!err) {
            res.json(id);
        } else {
            console.log(err);
        }
    });
});


// Handles adding / removing word from the revision list
app.post('/toggleRevisionList', function(req, res) {
  var revision_list = req.body.revision_list;
  if(revision_list == true) {
    revision_list = false;
  } else {
    revision_list = true;
  }

  Word.update({ _id: req.body._id }, { revision_list: revision_list }, function(err) {
    if (!err) {
        res.json(revision_list);
    } else {
        console.log(err);
    }
  });
  
});


// Default route (if exists in Angular but not in API)
app.get('*', function (req, res) {
    res.sendFile(__dirname +'/public/index.html');
});


/******************** SERVER **********************/

// Launch server
app.listen(port,ip)


