import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@spikhouse/api-interfaces';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    public constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    public async getUser(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id);
    }

    public async getUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({email});
    }

    public async checkUserPassword(id: string, password: string): Promise<boolean> {
        const user = await this.userModel.findById(id).select('password');
        if (!user) {
            return false;
        }

        return compare(password, user.password);
    }

    public async deleteUser(email: string): Promise<void> {
        const user = await this.userModel.findOne({email});
        if (user) {
            await user.remove();
        }
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
            if (e.name === 'MongoError' && e.code === 11000) {
                throw new ConflictException(email);
            }
            throw e;
        }

        const user = await this.getUser(newUser.id);
        if (!user) {
            throw new NotFoundException(newUser.id);
        }
        return user;
    }
}
