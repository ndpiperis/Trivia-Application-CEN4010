var socket = io();

const fs = require('fs');

let obj = {
    creatorQuiz: []
};

obj.creatorQuiz.push({id: "", title: "", questions: [{q: "", img: "", source: "", opt1: "", opt2: "", opt3: "", opt4: "", answer: ""}]});

var json = JSON.stringify(obj);

var fs = require('fs');
fs.writeFile('myjsonfile.json', json, 'utf8', callback);

$(document).ready(function() {
    $('.entry-form').submit(function(e) {
        ntitle = $('#title').val()
        nquestion = $('#question').val()
        nimg = $('#img').val()

        e.preventDefault();

    });
});
