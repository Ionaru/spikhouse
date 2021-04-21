import { Prop, Schema } from '@nestjs/mongoose';
import { IUser } from '@spikhouse/api-interfaces';
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class UserSchema extends Document<string> implements IUser {

    @Prop({required: true, unique: true})
    public email!: string;
    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;
}
