class Quiz {

    localCounter = 0

    localScore = [] 
    questions = []

    constructor(room) {
        //load quiz json into questions

        
    }

    pollQuestion() {
        //send question through socket
        socket.on('answer-received', checkQuestion(info))
    }

    checkQuestion() {
        if(info.answer == questions[0].correct) {
            local
        }
    }

    getScoreAtID(uid) {
        res = localScore.filter(o => {
            return o.id === uid;
        });
    }
    
}