import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoError } from 'mongodb';
import { Model } from 'mongoose';

import { UserSchema } from './user.schema';

@Injectable()
export class UsersService {
    public constructor(
        @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    ) {}

    public async getUsers(): Promise<UserSchema[]> {
        return this.userModel.find();
    }

    public async createUser(email: string): Promise<UserSchema> {
        const user = new this.userModel({email});

        try {
            await user.save();
        } catch (e) {
            if (e instanceof MongoError && e.code === 11000) {
                throw new ConflictException(email);
            }
        }

        return user;
    }
}
