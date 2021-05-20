describe('registration', () => {

    before(() => {
        cy.request('DELETE', '/api/users/auth@example.com').its('status').should('equal', 200);
    });

    after(() => {
        cy.request('DELETE', '/api/users/auth@example.com').its('status').should('equal', 200);
    });

    beforeEach(() => {
        cy.clearCookies();
        cy.visit('/');
    });

    afterEach(() => {
        cy.clearCookies();
    });

    it('should display the page', () => {
        cy.contains('Welcome to Spikhouse!');
        cy.contains('Please log in or create an account.');
        cy.contains('Email');
        cy.get('input[name="email"]').should('exist');
        cy.contains('Password');
        cy.get('input[name="password"]').should('exist');
        cy.get('button').contains('Log in');
    });

    it('can switch to registration and back', () => {
        cy.get('a').contains('create an account').click();
        cy.contains('Register new Spikhouse account');
        cy.get('a').contains('Log in').click();
        cy.contains('Welcome to Spikhouse!');
    });

    it('has to enter a valid email address to log in', () => {
        cy.login('ThisIsNotAnEmail', 'MyPassword12!', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a valid email address.');
    });

    it('has to enter a password to log in', () => {
        cy.login('auth@example.com', '', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please enter a password.');
    });

    it('can enter a password of any length', () => {
        cy.login('auth@example.com', 'A', false);
        cy.get('button[type="submit"]').should('be.enabled');
    });

    it('can not log in with invalid credentials', () => {
        cy.login('auth@example.com', 'A');
        cy.contains('Unknown login.', {timeout: 30000});
    });

    it('can create an account and log in', () => {
        cy.get('a').contains('create an account').click();
        cy.register('AuthTest', 'auth@example.com', 'Password!!', true);
        cy.contains('Account created, you can now log in.', {timeout: 30000});
        cy.get('a').contains('Log in').click();
        cy.login('auth@example.com', 'Password!!');
        cy.contains('AuthTest', {timeout: 30000});
        cy.contains('inside works!', {timeout: 30000});
    });

    it('can remember the user session', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.location('pathname', {timeout: 30000}).should('equal', '/inside');
        cy.visit('/');
        cy.location('pathname').should('equal', '/inside');
        cy.visit('/inside');
        cy.location('pathname').should('equal', '/inside');
    });

    it('can log out after logging in', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.contains('Logout', {timeout: 30000}).click();
        cy.contains('Welcome to Spikhouse!');
    });

    it('can no longer access inside after logging out', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.contains('Logout', {timeout: 30000}).click();
        cy.visit('/inside');
        cy.location('pathname').should('equal', '/');
    });

});
