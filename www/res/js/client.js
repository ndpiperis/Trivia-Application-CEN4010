var socket = io();
var room = 00000;
var errShown = false;

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
        showErr("Code must be 5 digits", true);
    }
});

//swaps view to game room
function changeToRoom(info) {
    console.log('Successfully joined room');
}

//receives join success packet, start room change
socket.on('join success', function(info) {
    changeToRoom(info);
});

//shows input error messages
function showErr(reason, o) {
    errShown = o;
    console.log("Error: " + reason);
    if(o) {
        $('.err').text(reason);
        $('.err').show();
        
    } else {
        $('.err').hide();
    }
    
    
}