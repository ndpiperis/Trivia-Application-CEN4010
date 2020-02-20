describe('Checks the content of the trivia app home page', () => {

    it('Navigates to the home page', () => {
        cy.visit('/index.html');
    });

    it('Verifies text, buttons and elements in the page', () => {
        cy.get('img.splash').should('exist');
        
        cy.get('input.landing-textfield').eq(0).should('have.attr', 'placeholder', 'Room Code');
        cy.get('input.landing-textfield').eq(1).should('have.attr', 'placeholder', 'Name');
        cy.get('input.landing-button').should('have.attr', 'type', 'button').should('have.value', 'Play');

        cy.get('h1.info-envelope-title').should('contain', 'Knowledge that sticks.');
        cy.get('h2').should('contain', 'How does Witti work?');
        });

});
