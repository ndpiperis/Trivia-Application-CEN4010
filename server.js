
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
app.use(express.static(__dirname + '/www/'));

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
//  code, owner, room name, users(socket id, name)
//]
var _rooms = [

  ];

var user_quizzes = [

];

//pushes room to array (ONLY ON ROOM CREATE)
function prepDataCreate(nroom, name, socket) {
  
  console.log('room-' + nroom);
  _rooms.push({
    code: nroom, 
    owner: socket.id,
    roomName: name + "'s room",
    users: [
      [socket.id, name]
    ]
  });
}

//gets room user is joining and sends info (May be deprecated in favor of getRoomAtID())
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

//pushes join info (ONLY ON ROOM JOIN)
function prepSocket(room, info, socket) {
  room.push([socket.id, info.name]);
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
        croom = getRoomAtCode(info.code);
        oid = croom.owner;
        
        socket.emit('join-success', croom);
        io.to(`${oid}`).emit('updated-users', croom);
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
        console.log('user created room-' + nroom);
        croom = getRoomAtCode(nroom);
        console.log(croom.owner);
        socket.emit('join-success', croom);
      });
    });

    socket.on('disconnect', function(){
      //room cleanup (not really working) *********************
      try {
        croom = getRoomAtID(socket.id);
        cleanRooms(socket.id);
        io.to(`${croom.owner}`).emit('updated-users', croom);
        console.log("Updating room " + croom.code + " with users " + croom.users);
      }
      catch(error) {
        console.log("Could not update rooms");
      }
      console.log(socket.id  + ' disconnected');

    });
  });


  //UTILITY FUNCTIONS

  //returns room at code or err
  function getRoomAtCode(code) {

    for (var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == code) {
        return _rooms[i];    
      }
    }
    return 1;
  }

  //returns room at id
  function getRoomAtID(id) {

    // res = _rooms.filter(o => {
    //   if(o.users.indexOf(id > 0)) {

    //   }
    // });
    for (var i = 0; i < _rooms.length; i++) {
      for (var j = 0; j < _rooms[i].users.length; j++) {
       
        if(_rooms[i].users[j][0] == id) {
          return _rooms[i];
        }
      }
    }
  }
    
  
//checks and removes empty rooms
  function cleanRooms(id) {
    console.log("Cleaning rooms...");

    // try {
    //   res = _rooms.filter(o => o.code == code);
    //   resobj = res.filter
    //   if(res.owner == id) {
    //     _rooms[i] = [];
    //     console.log("Room removed");
    //   }
    // }
    // catch(e) {
    //   console.log("Error occurred");
    // }

    if(_rooms != undefined) {
      try {
        for (var i = 0; i < _rooms.length; i++) {
          for (var j = 0; j < _rooms[i].users.length; j++) {
          
            if(_rooms[i].users[j][0] == id) {
              _rooms[i].users[j] = [];
              console.log("user removed");
              
              
            }
            if(_rooms[i].owner == id) {
              _rooms[i] = [];
              console.log("Room removed");
            }
            console.log("Active rooms: " + _rooms);
          }
        }
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  //does what name implies, returns boolean value
  function checkRoomExist(info, socket) {
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == info.code) {
        return true;
      }
    }
    return false;
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
 
  //provide array of users in console
  function listUsersInRoom(code) {
    console.log('Users in room:')
    res = _rooms.filter(o => o.code == code);
    console.log(res.users);
  }
  

  /////////////////////////////////////////////////////////
  //      QUIZ SECTION
  /////////////////////////////////////////////////////////
 
  io.on('quiz-start', function () {
    quiz = new Quiz(getRoomAtID(socket.id));
    quiz.pollQuestion();
  });


server.listen(4200);


