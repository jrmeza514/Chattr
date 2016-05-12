let http = require('http');
let express = require('express');
let io = require('socket.io');

let app = express();
let server = http.createServer(app);
let socket = io( server );

/*
  Make the Server User the files in the distribution
  folder with all the transpiled code
*/
app.use( express.static( __dirname + "/dist/") );

/*
  Route The Root of the server the index.html file in the
  dist folder
*/
app.get('/', function( req, res ){
  res.sendFile( __dirname + "/dist/index.html" );
});

/*
  Server Variables
*/
let users = [];
let chattrBuffer = [];
let chattrMaxBuffer = 50;

/*
    listen for when there is a new connection to the server
*/
socket.on('connection', function( client ){
  /*
    Send the client confirmation of a successful connection
  */
  client.emit('connected');

  /*
      Once the user receives confirmation that there is a connection,
      The will send the username they wish to use
  */

  client.on('joined', function ( username ){
    client.username = username;
    users.push(client.username);

    // Send the client a list of all the active users and the chaced messages
    client.emit('roster_update', users );
    client.emit('loadChat', chattrBuffer );

    // broadcast the new list of users to all other clients
    client.broadcast.emit('roster_update', users );

    // log the new user to the server console
    console.log( client.username + " has joined");
  });

  /* Listen for messages sent by the client */
  client.on('message', function( message ){
    // Check if we have reached the chattrBuffer limit and remove the first message
    if ( chattrBuffer.length === chattrMaxBuffer ) {
      let deletedMessage = chattrBuffer.shift();
      console.log( "deleted: " + JSON.stringify( deletedMessage ) );
    }
    // Add message to the buffer
    chattrBuffer.push( message );

    // Send the message back to the client and broadcast it to all other clients
    client.emit('message', message );
    client.broadcast.emit('message', message );
  });

  /*
    Listen when a user disconnects
  */

  client.on('disconnect', function(){
      // Remove user from the active users collection
      let index = users.indexOf( client.username );
      if ( index > -1 ) {
        users.splice( index , 1 );
      }
      // Send the new list of users to all other clients
      client.broadcast.emit('roster_update', users);

      // Log the the disconnected user to the server console
      console.log( client.username + ' left');
  });


});

server.listen( 8000 );