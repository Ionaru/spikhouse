// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-shadow
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
    interface Chainable<Subject> {
        login(email: string, password: string, submit?: boolean): void;
        register(displayName: string, email: string, password: string, submit?: boolean): void;
    }
}

const enterCredential = (field: string, input: string): void => {
    if (input) {
        cy.get(field).type(input, {});
    } else {
        cy.get(field).focus();
    }
    cy.get(field).blur();
};

// -- This is a parent command --
Cypress.Commands.add('login', (email, password, submit = true) => {
    enterCredential('input[name="email"]', email);
    enterCredential('input[name="password"]', password);

    if (submit) {
        cy.get('button[type="submit"]').click();
    }
});

Cypress.Commands.add('register', (displayName, email, password, submit = true) => {
    enterCredential('input[name="displayName"]', displayName);
    enterCredential('input[name="email"]', email);
    enterCredential('input[name="password"]', password);
    if (submit) {
        cy.get('button[type="submit"]').click();
    }
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
