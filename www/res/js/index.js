var jsonData = [
    {   //Example questions
        "q": "What does html stand for?",
        "opt1": "HyperText Markup Language",
        "opt2": "HyperText Transfer Protocol",
        "opt3": "Internet Protocol",
        "opt4": "None of the above",
        "answer": "HyperText Markup Language"
    },
    {
        "q": "What is SCRUM?",
        "opt1": "An agile method",
        "opt2": "A programming language",
        "opt3": "A learning method",
        "opt4": "None of the above",
        "answer": "An agile method"
    },
    {
        "q": "What does html stand for?",
        "opt1": "HyperText Markup Language",
        "opt2": "HyperText Transfer Protocol",
        "opt3": "Internet Protocol",
        "opt4": "None of the above",
        "answer": "HyperText Markup Language"
    },
    //End of example questions, continue below

    //Topic: " "
    {
        "q": "",
        "opt1": "",
        "opt2": "",
        "opt3": "",
        "opt4": "",
        "answer": ""
    },

    //End topic

    //Topic: " "
    {
        "q": "",
        "opt1": "",
        "opt2": "",
        "opt3": "",
        "opt4": "",
        "answer": ""
    },
    
    //End topic
    ];

var i = 0;
var correctCount = 0;
generate(0);
function generate(index) {
    document.getElementById("question").innerHTML = jsonData[index].q;
    document.getElementById("optt1").innerHTML = jsonData[index].opt1
    document.getElementById("optt2").innerHTML = jsonData[index].opt2;
    document.getElementById("optt3").innerHTML = jsonData[index].opt3;
    document.getElementById("optt4").innerHTML = jsonData[index].opt4;
}

function checkAnswer() {
    if (document.getElementById("optt1").checked && jsonData[i].opt1 == jsonData[i].answer){
        correctCount++;
    }
    if (document.getElementById("optt2").checked && jsonData[i].opt2 == jsonData[i].answer){
        correctCount++;
    }
    if (document.getElementById("optt3").checked && jsonData[i].opt3 == jsonData[i].answer){
        correctCount++;
    }
    if (document.getElementById("optt4").checked && jsonData[i].opt4 == jsonData[i].answer){
        correctCount++;
    }
    i++;
    if (jsonData.length-1 < i){
        document.write("Score is: " + correctCount);
    }

    generate(i);
}