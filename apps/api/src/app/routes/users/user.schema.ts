import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {

    @Prop({required: true, unique: true})
    public email!: string;
    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;

    public constructor(email: string) {
        this.email = email;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
