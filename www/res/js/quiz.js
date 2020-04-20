module.exports = class QuizBuilder {
    wait = 2000;
    socket;
    qroom;
    c;
    quiz;
    qcopy;
    users;
    reset;
    complete;
    current = [];

    finalScore;

    constructor(qroom, sock, selection, data, u) {
        global.current = [];
        this.complete = false;
        global.finalScore = [

        ];
        this.qroom = qroom;
        global.c = 0;
        global.reset = false;
        this.socket = sock;
        this.datab = data[selection];
        global.users = u;
        global.quiz = this.datab;
        global.qcopy = [];
        global.incorrect = {};
        
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
            c++;  
    }

    collect(info, id) {
        //var actualfuckingnumber = c-2;
        current.push({
            id : id,
            qid : info.qid,
            answer : info.answer
        });
        console.log(current.id);
    }

    getAnswersByUser(u) {
        var arrayBuilder = [];
        for(var i = 0; i < current.length; i ++) {
            if(current[i].id == u.id) {
                arrayBuilder.push({
                    answer : current[i].answer
                });
            }
        }
        return arrayBuilder;
    }

    calculate() {
        for(var i = 0; i < users.length; i ++) {
            ua = getAnswersByUser(users[i]);

        }
        
    }

    timer() {
        if(!reset) {
            var that = this;
            if(c == 5) {
                setTimeout(function() {
                    console.log("Pulling final answer from clients");
                    that.socket.to(that.qroom).emit('last-call-answer', c);
                    //that.calculate();
                    
                }, this.wait);
                console.log("Quiz finished");
                
                if(reset) {console.log("ignore");}
            }
            else {
                setTimeout(function() {
                    that.sendQuestion(); 
                    that.timer();
                }, this.wait);
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