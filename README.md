# Spikhouse

A web-based video conference and meeting app.

## Development

This project uses the [Nx development tools](https://nx.dev) and is based on the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(solution_stack)).

### How to run

Start a [MongoDB](https://www.mongodb.com/) database in [Docker](https://www.docker.com/):
```
docker run -p 27017:27017 --name mongo -d mongo:4
```

Run [Nest.js](https://nestjs.com/) backend
```
npx nx serve api
```

Run [Angular](https://angular.io/) frontend
```
npx nx serve client
```

Run [ESLint](https://eslint.org/) tests
```
npm run lint api
npm run lint client
npm run lint client-e2e
```

Run [Jest](https://jestjs.io/) unit tests
```
npx nx test api
npx nx test client
```

Run [Cypress](https://www.cypress.io/) end-to-end tests
```
npm run e2e
```


# Nx default documentation

This project was generated using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@spikhouse/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you
change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use
the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.
