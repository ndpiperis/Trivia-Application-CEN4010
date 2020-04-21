describe('Checks the content of the trivia quiz creator page', () => {

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

    it('Verfies and checks content on quiz creator page', () => {
       
        cy.get('legend').eq(0).should('contain', 'Quiz Title');
        cy.get('.landing-textfield.quiz-title').should('have.attr', 'type', 'text');

        for (i = 0; i < questionCount; i++) {
        cy.get('legend').eq(t).should('contain', 'Main Question:');
        cy.get('.tbox.landing-textfield').eq(i).should('exist');

        cy.get('#img.upload').eq(i).should('have.class', 'upload');
        cy.get('#img.upload').eq(i).should('have.value', 'Upload image');

        cy.get('#opt1-' + i).should('have.attr', 'placeholder', 'A');
        cy.get('#opt2-' + i).should('have.attr', 'placeholder', 'B');
        cy.get('#opt3-' + i).should('have.attr', 'placeholder', 'C');
        cy.get('#opt4-' + i).should('have.attr', 'placeholder', 'D');

        cy.get('#answer-' + i).should('have.attr', 'placeholder', 'Answer');
        t++;
        }

        cy.get('#submit').should('have.value', 'Submit');
    });

});