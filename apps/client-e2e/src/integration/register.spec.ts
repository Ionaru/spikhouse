describe('registration', () => {

    before(() => {
        cy.request('DELETE', '/api/users/cypress@example.com').its('status').should('equal', 200);
    });

    after(() => {
        cy.request('DELETE', '/api/users/cypress@example.com').its('status').should('equal', 200);
    });

    beforeEach(() => {
        cy.visit('register');
    });

    it('should display the page', () => {
        cy.contains('Register new Spikhouse account');
        cy.contains('Already have an account? Log in instead.');
        cy.contains('Display Name');
        cy.get('input[name="displayName"]').should('exist');
        cy.contains('Email');
        cy.get('input[name="email"]').should('exist');
        cy.contains('Password');
        cy.get('input[name="password"]').should('exist');
        cy.get('button').contains('Submit');
    });

    it('can not register an account with an empty name', () => {
        cy.register('', 'cypress@example.com', 'CypressPassword', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a name.');
    });

    it('can not register an account with too short a display name', () => {
        cy.register('AA', 'cypress@example.com', 'CypressPassword', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Name must be 3 characters or more.');
    });

    it('can not register an account with invalid email', () => {
        cy.register('CypressAccount', 'NotAMailAddress', 'CypressPassword', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a valid email address.');
    });

    it('can not register an account with an empty password', () => {
        cy.register('CypressAccount', 'cypress@example.com', '', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please create a password.');
    });

    it('can not register an account with too short a password', () => {
        cy.register('CypressAccount', 'cypress@example.com', '2021', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Password must be 8 characters or more.');
    });

    it('can register an account', () => {
        cy.register('CypressAccount', 'cypress@example.com', 'CypressPassword');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Account created, you can now log in.', {timeout: 30000});
    });

    it('can not register a duplicate account', () => {
        cy.register('CypressAccount', 'cypress@example.com', 'CypressPassword');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Email is already in use.', {timeout: 30000});
    });
});
