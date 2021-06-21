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
        cy.contains('Welcome to Spikhouse!').should('be.visible');
        cy.contains('Please log in or create an account.').should('be.visible');
        cy.contains('Email').should('be.visible');
        cy.get('input[name="email"]').should('exist');
        cy.contains('Password').should('be.visible');
        cy.get('input[name="password"]').should('exist');
        cy.get('button').contains('Log in');
    });

    it('can switch to registration and back', () => {
        cy.get('a').contains('create an account').click();
        cy.contains('Register new Spikhouse account');
        cy.get('a').contains('Log in').click();
        cy.contains('Welcome to Spikhouse!').should('be.visible');
    });

    it('has to enter a valid email address to log in', () => {
        cy.login('ThisIsNotAnEmail', 'MyPassword12!', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a valid email address.').should('be.visible');
    });

    it('has to enter a password to log in', () => {
        cy.login('auth@example.com', '', false);
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please enter a password.').should('be.visible');
    });

    it('can enter a password of any length', () => {
        cy.login('auth@example.com', 'A', false);
        cy.get('button[type="submit"]').should('be.enabled');
    });

    it('can not log in with invalid credentials', () => {
        cy.login('auth@example.com', 'A');
        cy.contains('Unknown login.', {timeout: 30000}).should('be.visible');
    });

    it('can create an account and log in', () => {
        cy.get('a').contains('create an account').click();
        cy.register('AuthTest', 'auth@example.com', 'Password!!', true);
        cy.contains('Account created, you can now log in.', {timeout: 30000}).should('be.visible');
        cy.get('a').contains('Log in').click();
        cy.login('auth@example.com', 'Password!!');
        cy.contains('AuthTest', {timeout: 30000}).should('be.visible');
        cy.contains('Create a new room', {timeout: 30000}).should('be.visible');
    });

    it('can not log in using an invalid password', () => {
        cy.login('auth@example.com', 'Password!!!');
        cy.contains('Unknown login.', {timeout: 30000}).should('be.visible');
    });

    it('can remember the user session', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.location('pathname', {timeout: 30000}).should('equal', '/rooms');
        cy.visit('/');
        cy.location('pathname').should('equal', '/rooms');
        cy.visit('/rooms');
        cy.location('pathname').should('equal', '/rooms');
    });

    it('can log out after logging in', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.contains('Logout', {timeout: 30000}).click();
        cy.contains('Welcome to Spikhouse!').should('be.visible');
    });

    it('can no longer access rooms after logging out', () => {
        cy.login('auth@example.com', 'Password!!');
        cy.contains('Logout', {timeout: 30000}).click();
        cy.visit('/rooms');
        cy.location('pathname').should('equal', '/');
    });

    it('can log in using any case letters in the email', () => {
        cy.login('AUTH@EXAMPLE.COM', 'Password!!');
        cy.location('pathname', {timeout: 30000}).should('equal', '/rooms');
        cy.contains('AuthTest', {timeout: 30000}).should('be.visible');
        cy.contains('Create a new room', {timeout: 30000}).should('be.visible');
    });

});
