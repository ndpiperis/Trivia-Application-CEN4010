//var socket = io();

var obj = [];

obj.creatorQuiz.push({title: "", questions: [{q: "", img: "", source: "", opt1: "", opt2: "", opt3: "", opt4: "", answer: ""}], review:{correct:"false", explanation:"", source:"", makeup:{q:"", image:"", opt1:"", opt2:"", answer:""}, main:{q:"", image:"", source:"", opt1:"", opt2:"", answer:""}}});

var json = JSON.stringify(obj);

var fs = require('fs');
//fs.writeFile('myjsonfile.json', json, 'utf8', callback);

fs.readFile('datatest.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now an object
    obj.creatorQuiz.push({id: "", title: "", questions: [{q: "", img: "", source: "", opt1: "", opt2: "", opt3: "", opt4: "", answer: ""}]}); //add some data
    json = JSON.stringify(obj); //converts it back to json
    fs.writeFile('datatest.json', json, 'utf8', callback); // write its back 
}});

console.log(obj);