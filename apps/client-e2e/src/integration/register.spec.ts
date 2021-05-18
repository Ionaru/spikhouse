describe('registration', () => {
    beforeEach(() => {
        cy.visit('register', {
            onBeforeLoad: (win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            },
        });
    });

    it('should display the page', () => {
        cy.contains('Register new account');
        cy.contains('Display Name');
        cy.get('input[name="displayName"]').should('exist');
        cy.contains('Email');
        cy.get('input[name="email"]').should('exist');
        cy.contains('Password');
        cy.get('input[name="password"]').should('exist');
        cy.contains('Submit');
    });

    it('can not register an account with an empty name', () => {
        cy.get('input[name="displayName"]').focus();
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').type('CypressPassword');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a name.');
    });

    it('can not register an account with too short a display name', () => {
        cy.get('input[name="displayName"]').type('AA');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').type('CypressPassword');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Name must be 3 characters or more.');
    });

    it('can not register an account with invalid email', () => {
        cy.get('input[name="displayName"]').type('CypressAccount');
        cy.get('input[name="email"]').type('NotAMailAddress');
        cy.get('input[name="password"]').type('CypressPassword');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please provide a valid email address.');
    });

    it('can not register an account with an empty password', () => {
        cy.get('input[name="displayName"]').type('CypressAccount');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').focus();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Please create a password.');
    });

    it('can not register an account with too short a password', () => {
        cy.get('input[name="displayName"]').type('CypressAccount');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').type('2021');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Password must be 8 characters or more.');
    });

    it('can register an account', () => {
        cy.get('input[name="displayName"]').type('CypressAccount');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').type('CypressPassword');
        cy.get('button[type="submit"]').click();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('@consoleLog').should('be.calledWith', 'Created user!');
    });

    it('can not register a duplicate account', () => {
        cy.get('input[name="displayName"]').type('CypressAccount');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="password"]').type('CypressPassword');
        cy.get('button[type="submit"]').click();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.contains('Email is already in use.');
    });
});
