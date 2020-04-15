describe('Checks the content of the trivia app home page', () => {

    it('Navigates to home page', () => {
        cy.visit('localhost:25565');
    });

    it('Navigates to quiz creator page', () => {
        cy.get('a[href="quiz_creator.html]').click();
    });
    
    it('Verfies and checks content on quiz creator page', () => {
        cy.get('h1').should('contain', 'Quiz Creator');
    });

});