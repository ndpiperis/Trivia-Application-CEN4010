describe('Checks the content of the trivia quiz creator page', () => {

    it('Navigates to home page', () => {
        cy.visit('localhost:25565');
    });

    it('Navigates to quiz creator page', () => {
        cy.get('#quiz-creator').click();
    });
    
    it('Verfies and checks content on quiz creator page', () => {
        cy.get('h1').should('contain', 'Quiz Creator');
        cy.get('legend').eq(0).should('contain', 'Quiz Title');
        cy.get('.landing-textfield.quiz-title').should('have.attr', 'type', 'text');

        cy.get('legend').eq(1).should('contain', 'Main Question:');
        cy.get('.tbox.landing-textfield').should('exist');

        cy.get('#img').eq(0).should('have.class', 'upload');
        cy.get('#img').eq(0).should('have.value', 'Upload image');

        cy.get('#opt1').should('have.attr', 'placeholder', 'A');
        cy.get('#opt2').should('have.attr', 'placeholder', 'B');
        cy.get('#opt3').should('have.attr', 'placeholder', 'C');
        cy.get('#opt4').should('have.attr', 'placeholder', 'D');

        cy.get('legend').eq(2).should('contain', 'Review');
        cy.get('#explanation').should('have.attr', 'placeholder', 'Explanation');
        cy.get('#example-question').should('have.attr', 'placeholder', 'Example Question');

        cy.get('#img').should('have.class', 'upload');
        cy.get('#img').should('have.value', 'Upload image');

        cy.get('#answer').should('have.attr', 'placeholder', 'Answer');

        cy.get('#makeup-question').should('have.attr', 'placeholder', 'Makeup Question');

        cy.get('#img').should('have.class', 'upload');
        cy.get('#img').should('have.value', 'Upload image');

        cy.get('#opt1-review').should('have.attr', 'placeholder', 'A');
        cy.get('#opt2-review').should('have.attr', 'placeholder', 'B');
    });

});