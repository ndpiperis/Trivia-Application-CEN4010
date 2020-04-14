
//  Clyde Goodall 2020
    
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
    ongoing : false,
    owner: socket.id,
    roomName: name + "'s room",
    users: [
      
    ]
  });
}

//gets room user is joining and sends info (May be deprecated in favor of getRoomAtID())
function prepDataJoin(info, socket) {
  var c = 0
  _rooms.forEach(function(current) {
    if(current.code == info.code) {
      prepSocket(_rooms[c], info, socket);
    }
    c++;
  });
}

//pushes join info (ONLY ON ROOM JOIN)
function prepSocket(room, info, socket) {
  room.users.push([socket.id, info.name]);
  socket.username = info.name;
  socket.room = info.code;

}

io.on('connection', function(socket){
    console.log( socket.id + ' connected');

    //joining request
    socket.on("join", function(info) {
      console.log('attempting to join room ' + info.code);

      if (checkRoomExist(info, socket)) {
          croom = getRoomAtCode(info.code);
          if(croom.ongoing == false) {
          socket.join(info.code, function() {
            
          prepDataJoin(info, socket);
          console.log('user joined room-' + info.code);
          
          
          oid = croom.owner;
          
          socket.emit('join-success', croom);
          io.to(`${oid}`).emit('updated-users', croom);
          listUsersInRoom(info.code);
          });
        } else {
          console.log("user cannot join an ongoing quiz");
          io.to(`${socket.id}`).emit('cannot-join', {reason : 'Quiz in-progress. Try again later'});
        } 
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

    //send question to room
    socket.on("new-question", function(info) {
      socket.to(`${info.room}`).emit('new-question-server', info.question);
      console.log(info.question);
    });
  

    //QUIZ 
    socket.on('start-quiz-owner', function(room) {
      console.log('room ' + room.room + ' starting quiz');
      socket.to(room.room).emit('start-quiz');
      var croom = getRoomAtCode(room.room);
      croom.ongoing = true;
    });

    socket.on('collect-answer', function(room) {
      io.to(`${room}`).emit('collect-answer-server', )
    })


    socket.on('disconnect', function(){
      //croom giving problems :(
      console.log("user leaving");
      

      if(_rooms.length > 0) {
        croom = getRoomAtID(socket.id);
        if(croom == false) {}
        else {
          try {
            console.log(croom.code + ' being updated');       
            cleanRooms(socket.id);
            console.log("Updating room " + croom.code + " with " + croom.users.length + " users ");
            io.to(`${croom.owner}`).emit('updated-users', croom);
          } 
          catch(e) {
            console.log(e);
          }
         }
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
    
      for (var i = 0; i < _rooms.length; i++) {
        for (var j = 0; j < _rooms[i].users.length; j++) {
          console.log(_rooms[i]);
          if(_rooms[i].users[j][0] == id || _rooms[i].owner == id) {
            console.log(_rooms[i]);
            return _rooms[i];
          }
          else {
            return false;
          }
        }
     } 
  }

  function reloadUsers(room) {
    console.log('redirecting users');
    io.to(`${room.code}`).emit('redirect', '/index.html');
  }
    
//checks and removes empty rooms
  function cleanRooms(id) {
    console.log("Cleaning rooms...");


        for (var i = 0; i < _rooms.length; i++) {
          var current = _rooms[i].users;

          for (var j = 0; j < current.length; j++) {
          
            if(_rooms[i].owner == id) {
              reloadUsers(_rooms[i]);
              //delete _rooms[i];
              _rooms.splice(i, 1);
              console.log("Room removed");
            }
            else if(current[j][0] == id) {
              //delete current[j];
              current.splice(j, 1);
              console.log("user removed");

            }
            else if(_rooms != undefined) {
              console.log("Active rooms: " + _rooms);
            }
            else {
              console.log('No active rooms');
            }
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
    for(var i = 0; i < _rooms.length; i++) {
      if(_rooms[i].code == code) {
        console.log(_rooms[i].users);
        break;
      }
    }
  }
  



server.listen(25565);


