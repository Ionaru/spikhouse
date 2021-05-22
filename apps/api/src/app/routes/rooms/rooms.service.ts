import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { Room, RoomDocument } from './room.schema';

@Injectable()
export class RoomsService {
    public constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    ) {}

    public async getRooms(): Promise<RoomDocument[]> {
        return this.roomModel.find().populate('owner', 'displayName');
    }

    public async getRoom(id: string): Promise<RoomDocument | null> {
        return this.roomModel.findById(id);
    }

    public async deleteRoom(id: string): Promise<void> {
        const room = await this.getRoom(id);
        if (room) {
            await room.remove();
        }
    }

    public async createRoom(name: string, owner: string, password?: string): Promise<RoomDocument> {
        if (password) {
            password = await hash(password, 10);
        }

        const newRoom = new this.roomModel({name, owner, password, hasPassword: !!password});
        await newRoom.save();

        const room = await this.getRoom(newRoom.id);
        if (!room) {
            throw new NotFoundException(newRoom.id);
        }
        return room;
    }
}
