import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongoStore from 'connect-mongo';
import { SessionData } from 'express-session';
import { SessionModule } from 'nestjs-session';

import { UsersModule } from './routes/users.module';

const mongoUrl = 'mongodb://localhost/spikhouse';

@Module({
    imports: [
        // Creates the database connection automatically on application startup.
        MongooseModule.forRoot(mongoUrl, {useCreateIndex: true}),
        SessionModule.forRoot({
            session: {
                cookie: {
                    maxAge: 604_800_000, // 7 days
                },
                name: 'Spikhouse',
                resave: false,
                saveUninitialized: false,
                secret: process.env.SESSION_SECRET || 'spikhouse_secret',
                store: AppModule.mongoStore,
            },
        }),
        UsersModule,
    ],
})
export class AppModule {
    public static readonly mongoStore = MongoStore.create({mongoUrl});

    public static getSession(sessionId: string): Promise<SessionData> {
        return new Promise(((resolve, reject) => {
            AppModule.mongoStore.get(sessionId, (error: any, session: SessionData | undefined | null) => {
                if (error) {
                    return reject(error);
                }

                if (!session) {
                    return reject('Invalid session');
                }

                return resolve(session);
            });
        }));
    }
}
