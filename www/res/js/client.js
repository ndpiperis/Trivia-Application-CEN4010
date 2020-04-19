
var socket = io();
//global room code
var room = 00000;
var errShown = false;
var qno = 0;
var submitted = null;
var owner = 0;
var sent = false;
var freshStart = true;


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

    function populateDropdown() {
        $.getJSON('json/data.json', function(data) {
            $.each(data, function(i, q) { 
                $('.quiz-list').append('<option id="' + q.id + '" class="q' + i + '">' + q.title + '</option>');              
            });
        });
    }

    //swaps view to game room
    function changeToRoom(info) {
        room = info.code;
        owner = info.owner;
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

    $('.q-box').on('click', '#start', function() {
        var selection = $('.quiz-list').find(":selected").attr('id');
        console.log('starting quiz');
        if(selection != null){
            socket.emit('start-quiz-owner', {
                room : room,
                selection: selection
            });
        }
        $('.q-box .start').prop('disabled', true);
        $('.q-box #reset').prop('disabled', false);
        console.log("Owner has selected quiz " + selection);
        selection = null;
    });

    $('.q-box').on('click', '#reset', function() {
        console.log('resetting quiz');
        socket.emit('reset-quiz-owner', {
            room : room,
            id : socket.id
        });
        $('.q-box .start').prop('disabled', false);
        $('.q-box .reset').prop('disabled', true);
        
    });



    $('.q-box').on('mousedown', '.qa', function() {
        console.log("#" + room);
        submitted = true;
        $(this).addClass('activated'); 
        $('.qa').not(this).attr('disabled', 'true');      
        submitted = $(this);
        socket.emit('collect-answer', {
            qid : qno,
            code : room,
            answer : submitted.attr('value')
        });
        sent = true;
    });

    //////////////////////////////
    //     SOCKET HANDLING      //
    //////////////////////////////



    //receives join success packet, start room change
    socket.on('join-success', function(info) {
        room = info.code;
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

    //resets global vars
    socket.on('reset-quiz', function(info) {
        console.log("resetting room");
        if( socket.id != info.room.owner) {
            console.log("resetting room");
            $('.q-box').loadTemplate('modules/quiz-waitroom.html',{
                title : 'Room ' + room
            });
        }
        qno = 0;
        submitted = null;
        owner = 0;
        sent = false;
        freshStart = true;
    });

    //loads question ui template from quiz.html or quiztf.html
    socket.on('new-question', function(qu) {
        
        //console.log('Receiving new question from quiz');
        console.log(qu.q);
        //$(this).removeClass('activated'); 
        //$('.qa').not(this).attr('disabled', 'false'); 

        if(qu.opt3 === undefined && qu.opt4 === undefined) {
            $('.q-box').loadTemplate('modules/quiztf.html', 
                {
                question :  qu.q,
                graphic  :  qu.image, 
                opt1 : qu.opt1,
                opt2 : qu.opt2
                }
            );
        } 
        else {
            $('.q-box').loadTemplate('modules/quiz.html', 
                {
                question :  qu.q,
                graphic  :  qu.image, 
                opt1 : qu.opt1,
                opt2 : qu.opt2,
                opt3 : qu.opt3,
                opt4 : qu.opt4
                }
            );           
        }

        if(qu.image != "" && qu.image != " ") {    
            $(".qimg").show();
        }
        submitted = null;
        if(!freshStart) collectPrevious();
        freshStart = false;
    });

    socket.on('final-score', function(info) {
        console.log("Final score received");
        for(var i = 0; i < info.length; i++) { 
            if(socket.id == info[i].id) {

            }
            else {
                $('.q-box').loadTemplate('modules/quiz-score.html', 
                    {
                    score: info[i].score
                    }
                );
            }
        }
        $('score h1').css('color', 'rgb(' + (255 - score) + ',' + (155 + score) + ',' + (50 + (score/3) + ')'));
        qno = -1;

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

    function collectPrevious(qno) {
        if(!sent) {
            socket.emit('collect-answer', {
                qid : qno,
                code : room,
                answer : "---"
            });
            
        }
        sent = false;
        
    }

    
});

