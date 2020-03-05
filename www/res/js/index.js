var i = 0;
var correctCount = 0;

generate(0);
function generate(index){
    document.getElementById("question").innerHTML = jsonData[index].q;
    document.getElementById("optt1").innerHTML = jsonData[index].opt1
    document.getElementById("optt2").innerHTML = jsonData[index].opt2;
    document.getElementById("optt3").innerHTML = jsonData[index].opt3;
    document.getElementById("optt4").innerHTML = jsonData[index].opt4;

}

function checkAnswer() {
    if(document.getElementById("optt1").checked && jsonData[i].opt1 == jsonData[i].answer){
        correctCount++;
    }
    if(document.getElementById("optt2").checked && jsonData[i].opt2 == jsonData[i].answer){
        correctCount++;
    }
    if(document.getElementById("optt3").checked && jsonData[i].opt3 == jsonData[i].answer){
        correctCount++;
    }
    if(document.getElementById("optt4").checked && jsonData[i].opt4 == jsonData[i].answer){
        correctCount++;
    }
    i++;
    if(jsonData.length-1 < i){
        document.write("Score is: " + correctCount);
    }

    generate(i);
}