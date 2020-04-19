module.exports = class QuizBuilder {
    socket;
    qroom;
    c;
    quiz;
    qcopy;
    users;
    reset;
    complete;
    current = [

    ];

    finalScore;

    constructor(qroom, sock, selection, data, u) {
        global.current = [];
        this.complete = false;
        global.finalScore = [

        ];
        this.qroom = qroom;
        global.c = 0
        global.reset = false;
        this.socket = sock;
        this.datab = data[selection];
        global.users = u;
        global.quiz = this.datab;
        global.qcopy = [];
        //console.log(quiz.questions[0].q);
        //console.log(quiz.questions[1].q);
        //console.log(quiz.questions[2].q);
        //console.log(quiz.questions[3].q);
        //console.log(quiz.questions[4].q);

        this.beginQuiz();
        
        
    }

    sendQuestion() {
        //sends the whole json entry to feed into template
        //console.log(c);

            if(quiz.questions[0].opt3 === undefined && quiz.questions[0].opt4 === undefined) {
                this.socket.to(this.qroom).emit('new-question', {
                    qno : c,
                    q : quiz.questions[0].q,
                    opt1 : quiz.questions[0].opt1,
                    opt2: quiz.questions[0].opt2,
                    image : quiz.questions[0].image
                });
            }
            else {
                this.socket.to(this.qroom).emit('new-question', {
                    qno : c,
                    q : quiz.questions[0].q,
                    opt1 : quiz.questions[0].opt1,
                    opt2 : quiz.questions[0].opt2,
                    opt3 : quiz.questions[0].opt3,
                    opt4 : quiz.questions[0].opt4,
                    image : quiz.questions[0].image
                });
            }
            qcopy.push(quiz.questions[0]);
            quiz.questions.splice(0, 1);
            console.log(c);
            c++;  
    }

    collect(info, id) {
        var actualfuckingnumber = c-1;
        current.push({
            qid : actualfuckingnumber,
            id: id,
            answer : info.answer
        });
        console.log(current);
    }

    calculate() {
        console.log(users);
        
       for(var i = 0; i < users.length; i++) {
            var total = 0;
           
            var filt = current.filter(function(a) {
               if(a.id == current[i].id) {
                    return true;
                } else {
                    return false;
               }
            });
            console.log(filt);
           
            for(var j = 0; j < qcopy.length; j++) {
                if(filt[j].answer == qcopy[j].answer) {
                    total+= 100;
                }
            }
            console.log("score:" + total);
            var final = Math.round(total / qcopy.length);
            finalScore.push({
                id: users[i].id,
                score: final
            });
        } 
        
        this.socket.to(this.qroom).emit('final-score', finalScore);
    }

    async timer() {
        if(!reset) {
            var that = this;
            if(c == 5) {
                setTimeout(function() {
                    that.calculate();
                    
                }, 3000);
                console.log("Quiz finished");
                quiz = qcopy;
                if(reset) {console.log("ignore");}
            }
            else {
                setTimeout(function() {
                    that.sendQuestion(); 
                    that.timer();
                }, 30000);
            } 
        }
    }


     beginQuiz() {
        this.sendQuestion();
        this.timer();
        
    }

    
    //self explanatory
    resetQuiz() {
        reset = true;

        // this.socket = null;
        // this.qroom = null;
        // c = null;
        // quiz = null;
        // qcopy = null;
        // users = null;
        // reset = null;
        // this.current = null;
        // finalScore = null;

    }

    
}