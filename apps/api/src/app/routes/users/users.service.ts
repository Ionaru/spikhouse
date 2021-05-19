import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { MongoError } from 'mongodb';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
    public constructor(
        @InjectModel(User.constructor.name) private userModel: Model<UserDocument>,
    ) {}

    public async getUser(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    public async getUsers(): Promise<UserDocument[]> {
        return this.userModel.find();
    }

    public async createUser(email: string, displayName: string, passwordRaw: string): Promise<UserDocument> {
        const password = await hash(passwordRaw, 15);
        const newUser = new this.userModel({email, displayName, password});
        try {
            await newUser.save();
        } catch (e) {
            if (e instanceof MongoError && e.code === 11000) {
                throw new ConflictException(email);
            }
            throw e;
        }

        return this.getUser(newUser.id);
    }
}
