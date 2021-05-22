import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from '../users/user.schema';

export type RoomDocument = Room & mongoose.Document;

@Schema({timestamps: true})
export class Room {

    @Prop({required: true, unique: false})
    public name: string;

    @Prop({required: false, unique: false, select: false})
    public password: string;

    @Prop({required: true, default: false})
    public hasPassword: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    public owner: User | mongoose.Schema.Types.ObjectId;

    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;

    public constructor() {
        throw new Error(
            'A Room should be created using "new this.roomModel({name, owner})", not through this constructor.',
        );
    }
}

export const RoomSchema = SchemaFactory.createForClass(Room);
