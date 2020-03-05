
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

console.log('ayy lmao');
console.log(
'    o   o\n'+
'     )-(\n' +
'    (O O)\n' +
'     \\\=/\n' +
'    .-"-.\n' +
'   //\/ \\\\\\\n' +
' _///   \\\\\\_\n' +
'=./ {,-.} \\.=\n' +
'    || ||\n' +
'    || ||    \n' +
'  __|| ||__  \n' +
' `---" "---\n');

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
         socket.emit('join-success', {
            code: nroom
          });
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
        socket.emit('join-success', {
          code: nroom
        });
      });
    });

    socket.on('disconnect', function(){
      if(_rooms.length > 0) {
        removeFromRoom(socket);
        cleanRooms();
      }
      console.log(socket.id  + ' disconnected');

    });
  });


  //UTILITY FUNCTIONS

  //gets room that socket is member of. breaks after first room is found, so it cannot get multiple rooms
  function removeFromRoom(socket) {
    
    for (var i = 0; i < _rooms.length; i++) {
      for(var j = 0; j < _rooms[i].users.length; j++) {
        if(_rooms[i].users[j] == socket.id) {
            if(_rooms.users && typeof _rooms.users.length > 0) {
              _rooms.users.splice(j, 1);  
              console.log(_rooms[i].users);
              if(_rooms[i].users.length == 0) {
                console.log('no users in room ' + _rooms[i].code +', room deleted');
                _rooms.splice(i, 1);  
              }
          }
        }      
      }
    }
  }

  //deletes socket id from users array for room. 
  

    //broadcast to all users in rom with updated user list
    
  

  function cleanRooms() {
    for (var i = 0; i < _rooms.length; i++) {

      
    }
  }


  function checkRoomExist(info, socket) {
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == info.code) {
        return true;
      }
    }
  }

  //generates random room code
  function randRoom() {
    nroom = Math.floor(Math.random()*90000) + 10000;
    for (var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == nroom) {
        randRoom();
      }
    }
    return nroom;
  }
 
  function listUsersInRoom(code) {
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == code) {
        console.log(_rooms[i].users);
      }
    }
  }
  
 

server.listen(4200);


