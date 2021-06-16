import { IAPIEnvironment } from '@spikhouse/api-interfaces';

export const environment: IAPIEnvironment = {
    dbHost: 'localhost',
    production: false,
    sessionName: 'Spikhouse',
    sessionSecret: 'spikhouse_secret',
};
