let http = require('http');
let express = require('express');
let io = require('socket.io');

let app = express();
let server = http.createServer(app);
let socket = io( server );

app.use( express.static( __dirname + "/dist/") );
app.get('/', function( req, res ){
  res.sendFile( __dirname + "/dist/index.html" );
});







let users = [];
let chattrBuffer = [];
let chattrMaxBuffer = 5;

socket.on('connection', function( client ){
  client.emit('connected');
  client.on('joined', function ( username ){
    client.username = username;
    users.push(client.username);
    console.log( client.username + " has joined");
    client.emit('roster_update', users );
    client.broadcast.emit('roster_update', users );
    client.emit('loadChat', chattrBuffer );
    client.broadcast.emit('loadChat', chattrBuffer );

  });
  client.on('disconnect', function(){
      let index = users.indexOf( client.username );
      if ( index > -1 ) {
        users.splice( index , 1 );
      }
      client.broadcast.emit('roster_update', users);
      console.log( client.username + ' left');
  });

  client.on('message', function( message ){
    if ( chattrBuffer.length === chattrMaxBuffer ) {
      let deletedMessage = chattrBuffer.shift();
      console.log( "deleted: " + JSON.stringify(deletedMessage) );
    }
    chattrBuffer.push( message );
    client.emit('message', message );
    client.broadcast.emit('message', message );
  });
});

server.listen( 8000 );
