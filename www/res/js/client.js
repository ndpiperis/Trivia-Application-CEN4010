var socket = io();
//global room code
var room = 00000;
var errShown = false;



//////////////////////////////
//      HOMEPAGE            //
//////////////////////////////
$(document).ready(function() {
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

    function loadJSON() {
        
    }

    function populateDropdown() {
        $.getJSON('json/data.json', function(data) {
            $.each(data, function(i, q){
                $('.quiz-list').append('<option id="' + q.id + '" class="q' + i + '">' + q.title + '</option>');
            });
        })
        
    }

    //swaps view to game room
    function changeToRoom(info) {
        room = info.code;
        console.log('Room ' + room);
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
            $('.q-box').loadTemplate('modules/quiz-manager.html',{
                title : 'Room ' + room
            });
            populateDropdown();
           
        } else {
            //loads spinner
            $('.q-box').loadTemplate('modules/quiz-waitroom.html',{
                title : 'Room ' + room
            });

            console.log('Server: Successfully joined room #' + info.code);
        }
        //prints room code in both owner and player ui
        

    }

    //refreshes the list of users in the room every time join/leave occurs
    function updateUserList(info) {
        $(".members").empty();
        for(var i = 0; i < info.users.length; i++)  {
            if(info.users[i][1] != undefined) {
                appendUser(info.users, i);
            }
            else {
                appendUser(info.users, i + 1);
            }
        }
    }

    function appendUser(user, i) {
        $(".members").append("<div class='user'>" + user[i][1] + "</div>");
    }

    $('.q-box').on('click', '.start', function() {
        
        console.log('starting quiz');
        socket.emit('start-quiz-owner', {
            room : room
        });
        $('.q-box .start').prop('disabled', true);
        var selection = $('.quiz-list').find(":selected").attr('id');
        console.log("Owner has selected quiz " + selection);
        quiz = new QuizBuilder(room, socket, selection);
        quiz.beginQuiz(socket);

    });

    var prevBtn = 0;
    var btnPressed = false;
    $('.qa').click(function() {
        console.log('selected answer');
        if(btnPressed) {
            prevBtn.toggleClass('active');
            prevBtn = this;
        }
        this.toggleClass('active');
        
    });

    //////////////////////////////
    //     SOCKET HANDLING      //
    //////////////////////////////



    //receives join success packet, start room change
    socket.on('join-success', function(info) {
        changeToRoom(info);
        console.log("Owner: " + info.owner);
        if(info.owner == socket.id) {
            updateUserList(info);
        }
    });

    socket.on('cannot-join', function(reason) {
        showDialog(reason.reason, true, false);
    });

    //pulls users from server
    socket.on('updated-users', function(room) {
        if(room.owner == socket.id) {
            console.log("You are the owner of this room");
            updateUserList(room);
        }
    });

    socket.on('new-question-server', function(q) {
        console.log('Receiving new question from quiz');
        console.log(q);
        $('.q-box').loadTemplate('modules/quiz.html', 
            {
                question :  q.qu,
                graphic  :  q.image, 
                opt1 : 'A) ' + q.opt1,
                opt2 : 'B) ' + q.opt2,
                opt3 : 'C) ' + q.opt3,
                opt4 : 'D) ' + q.opt4
            }
        );
    
    });

    socket.on('collect-answer', function(room) {

    });

    socket.on('redirect', function(destination) {
        console.log("refreshing");
        window.location.href = destination;

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

    //////////////////////////////
    //     HELPERS              //
    //////////////////////////////

    

    
});