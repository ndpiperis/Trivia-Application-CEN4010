
    //  Clyde Goodall 2020

    // ->init server 
    //     ->pool user connections
    //         ->fetch IDs
    //         ->handle entering/leaving (using entry tokens represented as button ids)
    //             ->if joining room, ask for room
    //                 ->redirect user if code is correct
    //             ->if creating room, skip 
    //     ->user rooms (represent with objects. should be easier to handle properties)
    //         ->generate room id 
    //         ->handle entering/leaving
    //             ->update array of current users in room.IDs
    //                 ->pass client updated list
    //         ->lobby
    //             ->allow lobby owner to select topic
    //         ->handle game status
    //             ->when each user has accepted, start game
    //                 ->set/reset scores
    //                 ->wait for every user to answer, or a length of time (eg 30s)  }- (looped until end of question)
    //                 ->pop question from stack                                      }
    //                 ->winner declared
    //                     ->wait for users to elect to start new game
    //                     ->allow winner to pick new topic
    //                 ->exit game, redirect to homepage (will be changed if we opt to have a gameover landing screenf or users to collect/save question answer sources)
    //  * - completed
    
//includes xpress and initializes
const express = require('express');
const app = express();

//Creates server, binds socket to server
server = require('http').createServer(app)
const io = require('socket.io')(server);
console.log('Server initialized');


//include resources
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/www/res'));

//serves /www/, all files visible to client
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/www/");
});

console.log('Live, from /www/, its SATURDAY NIGHT LIVE');


//socket code
var _rooms = [

  ];

function switchRoom(code, name, socket) {
  console.log(name + ' sent to room #' + code);

  //joins user to room, sends succes message, updates all users in the room
  //socket.join(code);
  io.to('{socket.id}').emit('join success', {
    code: code,
    name: name
  });
  //socket.to(code).emit('user joined', name);
  
}

function createRoom(code, name, socket, b) {
  console.log("Attempting room creation");
  //generates code for room since none was entered, causing a room to be created
  if(b) { var code = Math.floor(Math.random()*90000) + 10000; }

  //adds room and info to registry array
  _rooms.push(
    [ code, name + "'s Room'", 
      [
        socket.id
      ]
]
  );

  console.log(name + "'s room (" + code + ") successfully created. Added to array");
  for(var i = 0; i < _rooms.length; i++) {
    console.log("Room #" + i + ": " + _rooms[i][0]);
  }
  switchRoom(code, name, socket);
}

function joinRoom(code, name, socket) {
  console.log('user attempting to join room ' + name);
  if(_rooms.length > 0) {
    //tests for match in room array
    for(var i = 0; i < _rooms.length; i++) {

      if(code == _rooms[i][0]) {

        //emits success event
        
        switchRoom(code, name, socket);
        break;
        
      }
      //no match yet
    }
    //no match log
  
  } else {
    
    //creates room if user attempts to join room where none exist
    console.log('No available rooms, creating one now');
    createRoom(code, name, false);
  }
}

io.on('connection', function(socket){
    console.log( socket.id + ' connected');

    socket.on("join", function(info) {
      if(socket.rooms.indexOf(_rooms) >= 0) {
        console.log('user already in room');
      }
       console.log('attempting to join room ' + info.code);
      joinRoom(info.code, info.name, socket);
    });
    
    socket.on("create", function(info) {
      if(socket.rooms.indexOf(_rooms) >= 0) {
        console.log('user already in room');
      }
      console.log('attempting room creation: ' + info.name);
      createRoom(info.code, info.name, socket, true);
    });

    socket.on('disconnect', function(){
      
      console.log(socket.id  + ' disconnected');
    });
  });

  function isInRoom(socket) {

  }

 
  
 

server.listen(4200);


