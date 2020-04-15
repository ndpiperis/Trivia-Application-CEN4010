class QuizBuilder {

    constructor(qroom, sock, selection) {
        this.localCounter = 0;
        this.room = qroom;
        this.socket = sock;
        this.quiz = [];
        var data;
        //load quiz json into questions
        console.log("Finding " + selection);
        $.getJSON('../json/data.json', function(data) {
            console.log(data[selection].questions);
            this.data = data[selection].questions
        }, function() {
            this.quiz.push(data);
        });
        this.quiz.push(data);
        console.log("sending...");
        this.beginQuiz(sock);
    }

     sendQuestion(socket) {
        //sends the whole json entry to feed into template
     
        console.log(this.quiz);
        socket.emit('new-question', {
            question: this.quiz.questions[this.localCounter],
            room: this.room
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