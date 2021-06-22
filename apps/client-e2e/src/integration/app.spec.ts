describe('registration', () => {

    before(() => {
        cy.clearCookies();
    });

    it('should display the page', () => {
        cy.visit('/');
        cy.contains('Welcome to Spikhouse!').should('be.visible');
    });

    it('should display an error', () => {
        cy.intercept('api/auth', {
            statusCode: 504,
        });
        cy.visit('/');
        cy.contains('Http failure response for http://localhost:4200/api/auth: 504 Gateway Timeout').should('be.visible');
    });

});
