module.exports = class QuizBuilder {

    socket;
    qroom;
    localCounter;
    quiz;
    data
    constructor(qroom, sock, selection, data) {
        global.qroom = qroom;
        global.localCounter = 0;
        this.socket = sock;
        global.datab = data[selection];
        global.quiz = datab
        console.log(selection);
        console.log("sending..." + datab);
        console.log(qroom);
        this.beginQuiz(this.socket);
    }

    sendQuestion(socket) {
        //sends the whole json entry to feed into template
     
        console.log(quiz.questions[this.localCounter].q);
        socket.to(qroom).emit('new-question', {
            q : quiz.questions[this.localCounter].q,
            opt1 : quiz.questions[this.localCounter].opt1,
            opt2: quiz.questions[this.localCounter].opt2,
            opt3 : quiz.questions[this.localCounter].opt3,
            opt4 : quiz.questions[this.localCounter].opt4,
            image : quiz.questions[this.localCounter].image
        });
        this.localCounter++;
    }

     checkQuestion() {
        //todo
    }

     getScoreAtID(uid) {
        res = localScore.filter(o => {
            return o.id === uid;
        });
    }

     timer(socket) {
         //for(var i = 0; i < 2; i++) {
             //setInterval(this.sendQuestion(socket), 30000);
             //socket.emit('collect-answers', this.room);
         //}
    }

     beginQuiz(sock) {
        this.sendQuestion(sock);
        //this.timer(socket);
    }
    
}