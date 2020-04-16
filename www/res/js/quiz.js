module.exports = class QuizBuilder {
    socket;
    qroom;
    localCounter;
    quiz;
    history = [

    ];
    current = [

    ];

    constructor(qroom, sock, selection, data) {
        this.qroom = qroom;

        this.localCounter = 0;
        this.socket = sock;
        this.datab = data[selection];
        this.quiz = this.datab
        this.beginQuiz();
        //console.log(quiz);
    }

    sendQuestion() {
        //sends the whole json entry to feed into template
        
        if(typeof(this.quiz.questions[this.localCounter].opt3) != undefined && typeof(this.quiz.questions[this.localCounter].opt4) != undefined) {
            this.socket.to(this.qroom).emit('new-question', {
                q : this.quiz.questions[this.localCounter].q,
                opt1 : this.quiz.questions[this.localCounter].opt1,
                opt2 : this.quiz.questions[this.localCounter].opt2,
                opt3 : this.quiz.questions[this.localCounter].opt3,
                opt4 : this.quiz.questions[this.localCounter].opt4,
                image : this.quiz.questions[this.localCounter].image
            });

        }
        else {
            socket.to(qroom).emit('new-question', {
                q : this.quiz.questions[this.localCounter].q,
                opt1 : this.quiz.questions[this.localCounter].opt1,
                opt2: this.quiz.questions[this.localCounter].opt2,
                image : this.quiz.questions[this.localCounter].image
            });
        }
        //this.localCounter++;
    }

    collect(info, id) {
        console.log("answer received (" + id + ") : " + info.answer);
        this.localCounter++;
        this.sendQuestion();
    }

     checkQuestion() {
        //todo
    }

    //  getScoreAtID(uid) {
    //     res = localScore.filter(o => {
    //         return o.id === uid;
    //     });
    // }

     beginQuiz() {
        this.sendQuestion();
        //this.timer();
    }
    
    //self explanatory
    resetQuiz() {
        this.localCounter = 0;
        quiz = '';
        data = ''
    }

    //socket listeners
    
}