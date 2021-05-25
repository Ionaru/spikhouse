import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const dbs: MongoMemoryServer[] = [];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        const mongodb = new MongoMemoryServer();
        const mongoUri = await mongodb.getUri();
        dbs.push(mongodb);
        return {
            uri: mongoUri,
            useCreateIndex: true,
            ...options,
        };
    },
});

export const closeInMongodbConnections = async (): Promise<void> => {
    await Promise.all(dbs.map(async (db) => {
        await db.stop();
    }));
};
