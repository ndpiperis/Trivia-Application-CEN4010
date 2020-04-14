class QuizBuilder {

    room;
    localCounter = 0

    localScore = [] 
    questions = [

    ];

    constructor(qroom, sock) {
        this.room = qroom;
        this.socket = sock;
        //load quiz json into questions
        this.questions.push(
            {   //Example questions
                "img" : "img/test.jpg",
                "qu"   : "What does html stand for?",
                "opt1": "HyperText Markup Language",
                "opt2": "HyperText Transfer Protocol",
                "opt3": "Internet Protocol",
                "opt4": "None of the above",
                "answer": "HyperText Markup Language"
            }
        );
        this.questions.push(
        {   //Example questions
            "img" : "img/test.jpg",
            "qu": "What does html stand for 2nd? ",
            "opt1": "HyperText Markup Language 2nd",
            "opt2": "HyperText Transfer Protocol 2nd",
           " opt3": "Internet Protocol 2nd",
            "opt4": "None of the above 2nd",
            "answer": "HyperText Markup Language 2nd"
        }
    );
    console.log(this.questions);
        
        
    }

    sendQuestion(socket) {
        //sends the whole json entry to feed into template
        socket.emit('new-question', {
            question: this.questions[this.localCounter],
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
        // for(var i = 0; i < 2; i++) {
        //     setInterval(this.sendQuestion(socket), 5000);
        // }
    }

    beginQuiz(socket) {
        this.sendQuestion(socket);
        this.timer(socket);
    }
    
}