var socket = io();
var nameFilter = require('/json/nameFilter.json');

$('.entry-form').submit(function(e) {

    console.log( $('#name').val() );
    e.preventDefault();
    var entry = [$('#code').val(), $('#name').val()];

    for(var i = 0; i < nameFilter.) {

    }

    socket.emit('room code + name', )
});