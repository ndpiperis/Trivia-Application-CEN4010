var socket = io();
//global room code
var room = 00000;
var errShown = false;

//////////////////////////////
//      HOMEPAGE            //
//////////////////////////////

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


//////////////////////////////
//      UI UPDATES          //
//////////////////////////////


//swaps view to game room
function changeToRoom(info) {
    room = info.code;
    console.log($(window).height());
    $(".landing-splash, .landing-body").fadeOut(200, function() {
        $(".landing").addClass('fillScreen', 300).removeClass('landing', 300);
        $(".game-ui").fadeIn(500);
        $(".footer, .info-envelope").fadeOut(300);
        $('.landing-textfield').blur();
    });

    
    //tests if user in room is owner, sends quiz manager, loading screen if not
    if(info.owner == socket.id) {
        //loads manager
        $('.q-box').load('modules/quiz-manager.html');
    } else {
        //loads spinner
        $(".q-box").load('modules/quiz-waitroom.html');

        console.log('Server: Successfully joined room #' + info.code);
    }
    //prints room code in both owner and player ui
    $('.q-box h1').text('Room ' + info.code);

}

function changeToQuiz() {

    $(".info-envelope-title, .load").fadeOut(200, function() {
        $(".q-box").load('modules/quiz.html');
    });
}

function UpdateQuiz() {
    //todo
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

$('.q-box').on('click', '.start', function() {
    console.log('starting quiz');
    socket.emit('start-quiz-owner', {
        room : room
    });
    $('.q-box .start').prop('disabled', true);
});


//////////////////////////////
//     SOCKET HANDLING      //
//////////////////////////////



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
    console.log('owner is starting quiz');
    
   
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