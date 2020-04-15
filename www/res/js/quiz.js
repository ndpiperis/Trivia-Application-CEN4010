class QuizBuilder {

    room;
    localCounter = 0;
    localScore = [

    ];
    quiz = [

    ];

    constructor(qroom, sock, selection) {
        this.room = qroom;
        this.socket = sock;
        //load quiz json into questions
        console.log("Finding " + selection);
        $.getJSON('json/data.json', function(data) {
            // console.log(data);
            $.each(data, function(index, q) {
                console.log(q.id);
                this.quiz.push(q);
                console.log("Added " + q.title + " as active quiz");
            });
        });
    }

    sendQuestion(socket) {
        //sends the whole json entry to feed into template
        console.log(this.quiz);
        socket.emit('new-question', {
            question: this.quiz.questions[0],
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
         for(var i = 0; i < 2; i++) {
             setInterval(this.sendQuestion(socket), 30000);
             socket.emit('collect-answers', this.room);
         }
    }

    beginQuiz(socket) {
        this.sendQuestion(socket);
        this.timer(socket);
    }
    
}