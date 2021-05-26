import { Module, OnModuleInit } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Room, RoomDocument, RoomSchema, User, UserDocument, UserSchema } from '@spikhouse/api-interfaces';
import { Model } from 'mongoose';

import { AuthController } from './auth/auth.controller';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsService } from './rooms/rooms.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
    controllers: [UsersController, AuthController, RoomsController],
    imports: [
        // This allows us to use the UserSchema in this module.
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Room.name, schema: RoomSchema},
        ]),
    ],
    providers: [UsersService, RoomsService],
})
export class UsersModule implements OnModuleInit {
    public constructor(
        // This allows operations like querying, creating, updating and deleting.
        // const user = new this.userModel();
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    ) {}

    // onModuleInit is a lifecycle event that runs when the module is initialised (on application startup).
    // https://docs.nestjs.com/fundamentals/lifecycle-events
    public async onModuleInit(): Promise<void> {
        // This makes sure DB indexes (like unique constraints) are synced to the database on startup.
        // Without doing this for every schema, creating or removing an index does not apply in the database.
        await this.userModel.syncIndexes();
        await this.roomModel.syncIndexes();
    }

}
