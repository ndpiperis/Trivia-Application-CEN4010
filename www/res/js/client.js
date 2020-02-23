var socket = io();
var nameFilter = require('/json/nameFilter.json');

$('.entry-form').submit(function(e) {

    console.log( $('#name').val() );
    e.preventDefault();
    var entry = [$('#code').val(), $('#name').val()];

    socket.emit('room code + name', )
});