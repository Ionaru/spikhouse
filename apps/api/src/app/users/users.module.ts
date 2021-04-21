import { Module, OnModuleInit } from '@nestjs/common';
import { InjectModel, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    imports: [
        // This allows us to use the UserSchema in this module.
        MongooseModule.forFeature([
            {name: UserSchema.name, schema: SchemaFactory.createForClass(UserSchema)},
        ]),
    ],
    providers: [UsersService],
})
export class UsersModule implements OnModuleInit {
    public constructor(
        // This allows operations like querying, creating, updating and deleting.
        // const user = new this.userModel();
        @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    ) {}

    // onModuleInit is a lifecycle event that runs when the module is initialised (on application startup).
    // https://docs.nestjs.com/fundamentals/lifecycle-events
    public async onModuleInit(): Promise<void> {
        // This makes sure DB indexes (like unique constraints) are synced to the database on startup.
        // Without doing this for every schema, creating or removing an index does not apply in the database.
        await this.userModel.syncIndexes();
    }

}
