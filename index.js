var http = require('http');
var express = require('express');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var socket = io( server );

app.use( express.static( __dirname + "/client") );
app.get('/', function( req, res ){
  res.sendFile("/index.html");
});

socket.on('connection', function( client ){
  client.emit('connected');
});

server.listen( 8000 );
