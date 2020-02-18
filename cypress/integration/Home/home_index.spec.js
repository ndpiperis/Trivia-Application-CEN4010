describe('Checks the content of the trivia app home page', () => {

    it('Navigates to the home page', () => {
        cy.visit('/index.html');
    });

    it('Verifies text, buttons and elements in the page', () => {
        cy.get('h1.info-envelope-title').should('contain', 'Knowledge that sticks.');
    });

});
