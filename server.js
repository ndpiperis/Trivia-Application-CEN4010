
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
//[
//  code, room name, users
//]
var _rooms = [

  ];

function prepDataCreate(nroom, name, socket) {
  
  console.log('room-' + nroom);
  _rooms.push({
    code: nroom, 
    roomName: name + "'s room",
    users: [
      socket.id
    ]
  });
}

function prepDataJoin(info, socket) {
  for(var i = 0; i < _rooms.length; i++) {
    for(var j = 0; j < _rooms[i].users.length; j++) {
      if(_rooms[i].code == info.code) {
        prepSocket(_rooms[i].users, info, socket);
        return true;
      }
    }
  }
}

function prepSocket(room, info, socket) {
  room.push(socket.id);
  socket.username = info.name;
  socket.room = info.code;
}



io.on('connection', function(socket){
    console.log( socket.id + ' connected');

    //joining request
    socket.on("join", function(info) {
      console.log('attempting to join room ' + info.code);

      if (checkRoomExist(info, socket)) {
        socket.join(info.code, function() {
          
          prepDataJoin(info, socket);
          console.log('user joined room-' + info.code);
          listUsersInRoom(info.code);
        });
      } else {
        console.log("unable to join room");
      }
    });
    
    //creation request
    socket.on("create", function(info) {
      console.log('attempting room creation: ' + info.name);
      nroom = randRoom();
      socket.join(nroom, function() {
        
        prepDataCreate(nroom, info.name, socket);
        console.log('user joined room-' + nroom);
      });
    });

    socket.on('disconnect', function(){
      removeFromRoom(socket);
      console.log(socket.id  + ' disconnected');

    });
  });


  //UTILITY FUNCTIONS
  function isInRoom(socket) {
    for (var i = 0; i < _rooms.length; i++) {
      for(var j = 0; j < _rooms[i][3].length; j++) {

        if(io.sockets.adapter.sids[socket.id][_rooms[i][3][j]]) {
          console.log("User already in room");
          return true;
        }
    }
      return false;
    }
  }


  function checkRoomExist(info, socket) {
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == info.code) {
        return true;
      }
    }
  }

  function randRoom() {
    return nroom = Math.floor(Math.random()*90000) + 10000;
  }
 
  function listUsersInRoom(code) {
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == code) {
        console.log(_rooms[i].users);
      }
    }
  }
  
 

server.listen(4200);


