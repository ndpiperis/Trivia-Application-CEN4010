var socket = io();
var room = 00000;

$('.entry-form').submit(function(e) {
    showErr("", false);
    
    //disable page reload
    e.preventDefault();
    
    //code and name values, 0 and 1 respectively
    var entry = [$('#code').val(), $('#name').val()];
    
    //test room code for validity
    var codel = $('#code').val().length;

    //make sure code is 5 characters long
    if(codel == 5) {
        console.log('sending join request for room ' + $('#code').val());
        socket.emit("join", {
            code : $('#code').val(),
            name : $('#name').val()
        });
        room = $('#code').val();
    }
    else if(codel == 0){
        //signaling new room
        console.log('sending create request for room ' + $('#code').val());
        socket.emit("create", {
            code : $('#code').val(),
            name : $('#name').val()
        });
    }   
    else {
        showErr("Code must be 5 digits", true);
    }
});

function changeToRoom(info) {
    console.log('Successfully joined room');
}

socket.on('join success', function(info) {
    changeToRoom(info);
});


function showErr(reason, o) {
    console.log("Error: " + reason);
    if(o) {
        $('.err').text(reason);
        $('.err').show();
        
    } else {
        $('.err').hide();
    }
    
    
}