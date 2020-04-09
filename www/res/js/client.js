var socket = io();
//global room code
var room = 00000;
var errShown = false;

//game start


//entry form
$('.entry-form').submit(function(e) {
    ncode = $('#code').val()
    nname = $('#name').val()

    
    //disable page reload
    e.preventDefault();
    
    //code and name values, 0 and 1 respectively
    var entry = [ncode, nname];
    
    //test room code for validity
    var codel = ncode.length;

    //make sure code is 5 characters long
    if(codel == 5) {
        //signaling joining room
        console.log('sending join request for room #' + ncode);
        socket.emit("join", {
            code : ncode,
            name : nname
        });
        room = ncode;
    }
    else if(codel == 0){
        ncode = 00000;
        //signaling new room
        console.log('sending create request for room #' + ncode);
        socket.emit("create", {
            code : ncode,
            name : nname
        });
    }   
    else {
        showDialog("Code must be 5 digits", true, false);
    }
});

<<<<<<< HEAD


=======
$("#start").click(function() {
    console.log("You clicked this!");
    socket.to(room).emit("start-quiz");
});
>>>>>>> af0098a242ec0df5144f01ac2127fc02b3be67b6

//swaps view to game room
function changeToRoom(info) {
    //showDialog("Successfully joined room", true, true);
    room = info.room;
    console.log($(window).height());
    $(".landing-splash, .landing-body").fadeOut(200, function() {
        $(".landing").addClass('fillScreen', 300).removeClass('landing', 300);
        $(".game-ui").fadeIn(500);
        $(".footer, .info-envelope").fadeOut(300);
        $('.landing-textfield').blur();
    });

    if(info.owner == socket.id) {
        $('.q-box').append(" <h1>Room "+ info.code +"</h1>"+
            "<section class='switcher fc'>"+

            "<input type='button' id='your-quizzes' class='landing-button' value='Your Quizzes'>"+
            "<input type='button' id='premade-quizzes' class='landing-button' value='Premade Quizzes'>"+

        "</section>"+
        "<section class='members'>"+
            
        "</section>"+
        "<section class='menu'>"+

            "<input type='button' id='leave' class='landing-button' value='Leave'>"+
            "<input type='button' class='landing-button' value='View Lobby'>"+
            "<input type='button' class='landing-button start' value='Start'>"+

        "</section>");
    } else {
        $(".q-box").append("<h1 class='info-envelope-title'>Room " + info.code +" lobby</h1><img class='load' src='img/load.png'/>");
        console.log('Server: Successfully joined room #' + info.code);
    }
}


//refreshes the list of users in the room every time join/leave occurs
function updateUserList(info) {
    $(".members").empty();
    for(var i = 0; i < info.users.length; i++)  {
        if(info.users[i][1] != undefined) {
            $(".members").append("<div class='user'>" + info.users[i][1] + "</div>");
        }
    }
}

//receives join success packet, start room change
socket.on('join-success', function(info) {

    changeToRoom(info);
    console.log("Owner: " + info.owner);
    if(info.owner == socket.id) {
        console.log("You are the owner of this room");
        updateUserList(info);
    }
});

//pulls users from server
socket.on('updated-users', function(room) {
    if(room.owner == socket.id) {
        console.log("You are the owner of this room");
        updateUserList(room);
    }
});

socket.on('start-quiz', function() {
    $(".info-envelope-title, .load").fadeOut(200, function() {
        $(".q-box").append("<section class='qc'>" +
                "<section class='quiz-data'></section>" +
                    "<h2 class='shifted-title'>How much wood could a wood chuck chuck if a wood chuck could chuck wood</h2>" +
                    "<img src='test.jpg' class='qimg' alt='Picture Test' >" +
                "</section>" + 

                "<section class='a-box fc'>" +                       
                    "<input type='button' class='landing-button qa' value='This is the answer for A.'>" +
                    "<br>" +

            
                    "<input type='button' class='landing-button qa' value='This is the answer for B.'>" +
                    "<br>" +

            
                    "<input type='button' class='landing-button qa' value='This is the answer for C.'>" +
                    "<br>" +

            
                    "<input type='button' class='landing-button qa' value='This is the answer for D.'>" +
                "</section>" +
            "</section>");
    });
  
   
});

//shows input error messages
function showDialog(reason, o, i) {
    console.log("Attention: " + reason);
    if(o) {
        if(i) {
            $('.err').css({
                'background' : 'green'
            });
        } else {
            $('.err').css({
                'background' : 'rgba(255, 57, 57, .85)'
            });
        }
        $('.err').text(reason);
        $('.err').show();
        
    } else {
        $('.err').hide();
    }
    
    
}