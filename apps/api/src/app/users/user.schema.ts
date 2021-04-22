import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@spikhouse/api-interfaces';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User implements IUser {

    @Prop({required: true, unique: true})
    public email!: string;
    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;

    public constructor(email: string) {
        this.email = email;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
