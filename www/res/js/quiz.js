module.exports = class QuizBuilder {
    socket;
    qroom;
    c;
    quiz;
    qcopy;
    users;
    reset;
    
    current = [

    ];

    finalScore;

    constructor(qroom, sock, selection, data, u) {
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
        console.log(quiz.questions[0].q);
        console.log(quiz.questions[1].q);
        console.log(quiz.questions[2].q);
        console.log(quiz.questions[3].q);
        console.log(quiz.questions[4].q);

        this.beginQuiz();
        
        
    }

    sendQuestion() {
        //sends the whole json entry to feed into template
        //console.log(c);

            if(quiz.questions[0].opt3 === undefined && quiz.questions[0].opt4 === undefined) {
                this.socket.to(this.qroom).emit('new-question', {
                    qno : this.c,
                    q : quiz.questions[0].q,
                    opt1 : quiz.questions[0].opt1,
                    opt2: quiz.questions[0].opt2,
                    image : quiz.questions[0].image
                });
            }
            else {
                this.socket.to(this.qroom).emit('new-question', {
                    qno : this.c,
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
            c++;  
    }

    collect(info, id) {
        
        this.current.push({
            qid : c,
            id: id,
            answer : info.answer
        });
        console.log(this.current);
    }

    calculate() {
        
       for(var i = 0; i < users.length; i++) {
           var total = 0;
           var filt = this.current.filter(a => a.id = users[i].id);
           filt.forEach(function(index, item) {
            if(filt[index].answer == qcopy.questions[index].answer) {
                total++;
            }
           });
           console.log("score:" + total);
       }
    }

    timer() {
        if(!reset) {
            var that = this;
            if(c == 5) {
                setTimeout(function() {
                    
                    that.calculate();
                }, 3000);
                console.log("Quiz finished");
                if(reset) {console.log("ignore");}
            }
            else {
                setTimeout(function() {
                    that.sendQuestion(); 
                    that.timer();
                }, 3000);
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

    //socket listeners
    
}