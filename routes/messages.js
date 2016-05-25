var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var database = null;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }

  database = db;

});

var router = express.Router();

router.route('/messages')
      .get(function( req, res ){
        if ( db ) {
          db.collection('messages', function( err , messages ){
            response.json( messages.find() );
          });
        }else {
          res.status( 400 );
          res.send('Failed database connection!')
        }
      });

module.exports = router;
