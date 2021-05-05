import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoError } from 'mongodb';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
    public constructor(
        @InjectModel(User.constructor.name) private userModel: Model<UserDocument>,
    ) {}

    public async getUsers(): Promise<UserDocument[]> {
        return this.userModel.find();
    }

    public async createUser(email: string): Promise<UserDocument> {
        const user = new this.userModel({email});
        try {
            await user.save();
        } catch (e) {
            if (e instanceof MongoError && e.code === 11000) {
                throw new ConflictException(email);
            }
            throw e;
        }
        return user;
    }
}