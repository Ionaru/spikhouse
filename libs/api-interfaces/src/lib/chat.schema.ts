import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from './user.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({timestamps: true})
export class Chat {

    @Prop({required: false, unique: false})
    public name: string;

    @Prop({required: false, unique: false, select: false})
    public content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    public owner: User | mongoose.Schema.Types.ObjectId;

    public readonly createdAt!: Date | string;
    public readonly updatedAt!: Date | string;

    public constructor() {
        throw new Error(
            'A Chat history should be created using "new this.roomModel({name, owner})", not through this constructor.',
        );
    }
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
