describe('Checks the content of the trivia app home page', () => {

    it('Navigates to the home page', () => {
        cy.visit('localhost:25565');
    });

    it('Verifies text, buttons and elements in the page', () => {
        cy.get('img.splash').should('exist');
        
        cy.get('input.landing-textfield').eq(0).should('have.attr', 'placeholder', 'Room Code');
        cy.get('input.landing-textfield').eq(1).should('have.attr', 'placeholder', 'Name');
        cy.get('input.landing-button').should('have.attr', 'type', 'submit').should('have.value', 'Play');

        cy.get('h1.info-envelope-title').should('contain', 'Knowledge that sticks.');
        cy.get('h2').should('contain', 'How does Witti work?');
        });

        it('Checks the footers content of the page.', () => {
            cy.get('section.footer').should('exist');

            cy.get('h4.footer-section-title').should('contain', 'Site Links');
            
            cy.get('section.footer-item p').eq(0).find('a').should('have.attr', 'href', '#');
            cy.get('section.footer-item p').eq(0).find('a').should('contain', 'About');
            cy.get('section.footer-item p').eq(1).find('a').should('have.attr', 'href', 'https://github.com/ndpiperis/Trivia-Application-CEN4010').should('contain', 'Github');
            cy.get('section.footer-item p').eq(2).find('a').should('have.attr', 'href', 'https://socket.io/').should('contain', 'Socket.io');
        });
});
