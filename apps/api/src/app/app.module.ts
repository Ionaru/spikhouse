import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './routes/users/users.module';

@Module({
    imports: [
        // Creates the database connection automatically on application startup.
        MongooseModule.forRoot('mongodb://localhost/spikhouse', {useCreateIndex: true}),
        UsersModule,
    ],
})
export class AppModule {}
