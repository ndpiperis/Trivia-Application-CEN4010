
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
    res.sendFile(__dirname + "/www/index.html");
});

console.log('Live, from /www/, its SATURDAY NIGHT LIVE');


//socket code
var users = {};
var rooms = [
  [11111, "CJ's Room"]
];

function createRoom(code, name) {
  console.log("Attempting room creation");
  //generates code for room since none was entered, causing a room to be created
  var code = Math.floor(Math.random()*90000) + 10000;

  //adds room and info to registry array
  rooms.append = [
    [code, name + "'s Room"]
  ];

  console.log(name + "'s room (" + code + ") successfully created. Added to array");
  
}

function joinRoom(code, name) {
  console.log('user attempting to join room ' + name);
  if(rooms.length > 0) {
    //tests for match in room array
    for(var i = 0; i < rooms.length; i++) {

      if(code == rooms[i][0]) {

        //emits success event
        io.emit('join success', code);
        break;
        
      }
    }
  } else {

    //creates room if user attempts to join room where none exist
    console.log('No available rooms, creating one now');
    createRoom(info.code, info.name);
  }
}

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on("join", function(info) {
      console.log('attempting room join');
      joinRoom(info.code, info.name);
    });
  
    socket.on("create", function(info) {

      console.log('attempting room creation: ' + info.name);
      createRoom(info.code, info.name);
    });

    socket.on('disconnect', function(){
    console.log('user disconnected');
    });
  });

 
  
 

server.listen(4200);


