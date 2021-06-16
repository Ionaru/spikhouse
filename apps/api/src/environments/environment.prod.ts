import { IAPIEnvironment } from '@spikhouse/api-interfaces';

// Make sure this function is not called during runtime! Only during startup.
const getRequiredEnvValue = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`No value for ${key} specified!`);
    }
    return value;
};

export const environment: IAPIEnvironment = {
    dbHost: getRequiredEnvValue('SPIKHOUSE_API_DB_HOST'),
    production: true,
    sessionName: getRequiredEnvValue('SPIKHOUSE_API_SESSION_NAME'),
    sessionSecret: getRequiredEnvValue('SPIKHOUSE_API_SESSION_SECRET'),
};
