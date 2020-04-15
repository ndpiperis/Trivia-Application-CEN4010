var socket = io();

const fs = require('fs');

let obj = {
    creatorQuiz: []
};

obj.creatorQuiz.push({id: 1, question: 1});

var json = JSON.stringify(obj);

var fs = require('fs');
fs.writeFile('myjsonfile.json', json, 'utf8', callback);

