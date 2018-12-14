//copyright Junwei Zhou junwei23@bu.edu
// Required module
var dgram = require('dgram');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Port and IP
var PORT = 3000;
var HOST = '192.168.1.131';

var START = false;
var RESET = false;

//name database
var Name = ['Yuhang He', 'Junwei Zhou', 'Jeffrey Carruthers', 'Johannes Becker'];
var Here = [];
var NotHere = Name;
var N = Name.length;
// Create socket
var server = dgram.createSocket('udp4');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var name;
// Create server
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

// On connection, print out received message
server.on('message', function (message, remote) {
    //Reset
    if (RESET) {
      Here = [];
      NotHere = Name;
    }
    console.log(remote.address + ':' + remote.port +' - ' + message);
    console.log("waiting for message");
    // get the name 
    name = message.toString('utf8');
    var i = 0;
    var j = 0;
    var k = 0;

    if (START) {
      // create the attendance name list
      while (name != Here[i] && i <= Here.length) {
        i += 1; 
      }
      if (i > Here.length) {
        Here.push(name);
      }
      //create the absent name list
      NotHere = [];
      for (i = 0; i < N; i++) {
        k = 0;
        for (j = 0; j < Here.length; j++) {
          if (Name[i] == Here[j])
            k = 1;
        }
      if (k == 0)
        NotHere.push(Name[i]);
      }
    }
    console.log(Here);
    console.log(NotHere);

    //print acknowledgement
    server.send("Ok!",remote.port,remote.address,function(error){
      if(error){
        console.log('MEH!');
      }
      else{
        console.log('Sent: Ok!');
      }
    });
});

app.use(express.static('public'));
//home website
app.get('/home', function(req, res){
  res.sendFile(__dirname + '/attendance.html');
});
//get siganl passed from start button
app.get('/start', function(req, res){
  START = true;
  RESET = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});
//get siganl passed from stop button
app.get('/stop', function(req, res){
  START = false;
  RESET = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});
//get siganl passed from reset button
app.get('/reset', function(req, res){
  RESET = true;
  START = false;
  res.redirect('http://smartcontrol.ddns.net:3000/home');
});

//when the socket is on, run taking()
io.on('connection', function(socket){
  console.log('a user connected');
  taking();
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(PORT, function() {
  console.log('listening on *:%d', PORT);
});

//send back two name lists
var count = 0;
function taking(){
  if (RESET) {
    Here = [];
    NotHere = Name;
  }
  io.emit('here', Here);
  io.emit('nothere', NotHere);
  count ++;
}

if (count < 41){
    setInterval(taking, 1000);
}

// Bind server to port and IP
server.bind(PORT, HOST);
