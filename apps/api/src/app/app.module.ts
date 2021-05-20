import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongoStore from 'connect-mongo';
import { SessionModule } from 'nestjs-session';

import { UsersModule } from './routes/users/users.module';

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
                store: MongoStore.create({mongoUrl}),
            },
        }),
        UsersModule,
    ],
})
export class AppModule {}
