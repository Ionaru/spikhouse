import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodb: MongoMemoryServer;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongodb = new MongoMemoryServer();
        const mongoUri = await mongodb.getUri();
        return {
            uri: mongoUri,
            useCreateIndex: true,
            ...options,
        };
    },
});

// export const closeInMongodbConnection = async (): Promise<void> => {
//     if (mongodb) {
//         await mongodb.stop();
//     }
// };
