import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {

    @Prop({required: true, unique: true})
    public email: string;

    @Prop({required: true, unique: false})
    public displayName: string;

    @Prop({required: true, unique: false, select: false})
    public password: string;

    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;

    public constructor() {
        throw new Error(
            'A User should be created using "new this.userModel({email, displayName, password})", not through this constructor.',
        );
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
