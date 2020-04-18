describe('Checks the content of the trivia lobby page', () => {

    it('Navigates to the home page', () => {
        cy.visit('localhost:25565');
    });

    it('Inputs room name to create a room/lobby to start a quiz', () => {
        cy.get('#name').type('Cypress Test Room');
        cy.get('.landing-button').should('have.value', 'Play').click();
    });

    it('Checks if room is created and checks the content of the lobby user interface', () => {
        cy.get('h1').should('contain', 'Room ');

        cy.get('#your-quizzes').should('have.attr', 'type', 'button').should('have.value', 'Your Quizzes');
        cy.get('.quiz-list').should('exist');

        cy.get('.members').should('exist');

        cy.get('#leave').should('have.attr', 'type', 'button').should('have.value', 'Leave');
        cy.get('#reset').should('have.attr', 'type', 'button').should('have.value', 'Reset');
        cy.get('#start').should('have.attr', 'type', 'button').should('have.value', 'Start');
    });
});