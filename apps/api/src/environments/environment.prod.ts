const getDbHost = (): string => {
    const host = process.env.SPIKHOUSE_API_DB_HOST;
    if (!host) {
        throw new Error('No DB host specified!');
    }
    return host;
};

export const environment = {
    dbHost: getDbHost(),
    production: true,
};
