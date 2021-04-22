import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [AppController],
    imports: [
        // Creates the database connection automatically on application startup.
        MongooseModule.forRoot('mongodb://localhost/spikhouse', {useCreateIndex: true}),
        UsersModule,
    ],
    providers: [AppService],
})
export class AppModule {}
