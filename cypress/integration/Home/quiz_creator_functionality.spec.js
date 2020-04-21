describe('Inputs content of the trivia quiz creator page and verifies', () => {

    it('Navigates to home page', () => {
        cy.visit('localhost:25565');
    });
    
    it('Inputs name to create a room/lobby to create a quiz', () => {
        cy.get('#name').type('Cypress Test Room');
        cy.get('.landing-button').should('have.value', 'Play').click();
    });

    it('Clicks on Create Quiz and verifies if on page', () => {
        cy.get('#create-quiz').click();
        cy.get('h1').should('contain', 'Quiz Creator');
    });

    var questionCount = 5;
    var t = 1;

    it('Inputs required info in text boxes such as questions, option choices, answers, images', () => {
        cy.get('.landing-textfield.quiz-title').type('Cypress Witti Quiz');

        for (i = 0; i < questionCount; i++) {
            cy.get('legend').eq(t).should('contain', 'Main Question:');
            cy.get('.tbox.landing-textfield').eq(i).should('exist').type('What is Witti?');
    
            cy.get('#img.upload').eq(i).should('have.class', 'upload');
            cy.get('#img.upload').eq(i).should('have.value', 'Upload image');
    
            cy.get('#opt1-' + i).should('have.attr', 'placeholder', 'A').type('A');
            cy.get('#opt2-' + i).should('have.attr', 'placeholder', 'B').type('B');
            cy.get('#opt3-' + i).should('have.attr', 'placeholder', 'C').type('C');
            cy.get('#opt4-' + i).should('have.attr', 'placeholder', 'D').type('D');
    
            cy.get('#answer-' + i).should('have.attr', 'placeholder', 'Answer').type('A');
            t++;
            }

            //Clicks submit button when inputting all fields for quiz.
            cy.get('#submit').should('have.value', 'Submit').click();
    });
    
    it('Checks Created Quiz dropdown list to verify if quiz was created', () => {
      cy.get('#created-quiz-list').find('option').should('contain', 'Cypress Witti Quiz');
    });
});