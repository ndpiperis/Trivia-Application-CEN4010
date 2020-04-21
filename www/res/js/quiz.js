module.exports = class QuizBuilder {
    wait = 20000;
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
        global.cid = 0;
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
        global.incorrect = [];
        
        //console.log(quiz.questions[0].q);
        //console.log(quiz.questions[1].q);
        //console.log(quiz.questions[2].q);
        //console.log(quiz.questions[3].q);
        //console.log(quiz.questions[4].q);
        console.log(users);
        this.beginQuiz();
        
        
    }

    sendQuestion() {
        //sends the whole json entry to feed into template
        //console.log(c);
        try {
            console.log(quiz.questions[0].q);
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
        catch(e) {
            console.log("Could not send question. Did quiz reset?");
        }
    }

    collect(info, id) {
        //var actualfuckingnumber = c-2;
        current.push({
            id : id,
            qid : info.qid,
            answer : info.answer
        });
        console.log(current);
        
        if(cid >= ((c-1) * users.length)) {
            console.log(cid);
            this.calculate();
        }
        cid++;
    }

    getAnswersByUser(u) {
        //console.log(current.length);
        //console.log(u[0]);
        var arrayBuilder = [];
        for(var i = 0; i < current.length; i ++) {
            if(current[i].id == u[0]) {
                console.log("answer sorted");
                arrayBuilder.push(current[i].answer);
            }
        }
        //console.log(arrayBuilder);
        return arrayBuilder;
    }

    processScore(scores, user) {
        var score = 0;


        for(var i = 0; i < scores.length; i ++) {
           console.log(qcopy[i].answer);
            if(scores[i] == qcopy[i].answer) {
                console.log("right");
                score += 100;
            }
            else {
                console.log("wrong");
              incorrect.push({
                    id : user[0],
                    qo : qcopy[i]
                });
            }
        }

        console.log(incorrect);
        return (Math.round(score / qcopy.length));
    }

    loadScreen() {
        this.socket.to(this.qroom).emit('set-load-screen');
    }

    //sends review screen to user
    loadReview() {
        this.socket.to(this.qroom).emit('load-review-server', incorrect);
    }

    calculate() {
        this.loadScreen();
        var score = [];
        //console.log(qcopy);
        for(var i = 0; i < users.length; i ++) {
            console.log("calculating");
            var ua = this.getAnswersByUser(users[i]);
            

            score.push({
                score: this.processScore(ua, users[i]),
                id : users[i][0]
            });

            
        }
        console.log(score);
        this.socket.to(this.qroom).emit('final-score', score);
        
    }

    timer() {
        if(!reset) {
            var that = this;
            if(c == 5) {
                setTimeout(function() {
                    console.log("Pulling final answer from clients");
                    try
                    {
                        that.socket.to(that.qroom).emit('last-call-answer', c);
                    }
                    catch(e) {
                        console.log("Could not pull final answers, quiz probably reset");
                    }
                    
                    console.log("Quiz finished");
                    
                    return true;
                }, this.wait);
                
                
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


    async beginQuiz() {
        this.sendQuestion();
        this.timer();
        
        
    }

    

    //self explanatory
    resetQuiz() {
        console.log("resetting 4");
        reset = true;

        global.cid = 0;
        global.current = [];
        this.complete = true;
        global.finalScore = [

        ];
        this.qroom = null;
        global.c = 0;
        global.reset = false;
        this.socket = null;
        this.datab = null;
        global.users = [];
        global.quiz = null;
        global.qcopy = [];
        global.incorrect = [];
        
        current = [];


    }

    
}