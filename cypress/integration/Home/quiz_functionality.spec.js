describe('Checks the functionality of the quiz feature and content', () => {

    it('Navigates to the home page', () => {
        cy.visit('localhost:25565');
    });

    it('Inputs room name to create a room/lobby to start a quiz', () => {
        cy.get('#name').type('Cypress Test Room');
        cy.get('.landing-button').should('have.value', 'Play').click();
    });
    
    it('Chooses a quiz from the dropdown and presses start', () => {
        cy.get('#quiz-list').select('Software Engineering');
        cy.get('#start').click();
    });
});