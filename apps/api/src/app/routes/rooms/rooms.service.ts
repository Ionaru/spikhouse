import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from '@spikhouse/api-interfaces';
import { compare, hash } from 'bcrypt';
import { Model, Types } from 'mongoose';

import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
    public constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
        private readonly usersService: UsersService,
    ) {}

    public async getRooms(): Promise<RoomDocument[]> {
        return this.roomModel.find();
    }

    public async getRoom(id: string): Promise<RoomDocument | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.roomModel.findById(id);
    }

    public async checkRoomPassword(id: string, password: string): Promise<boolean> {
        const room = await this.roomModel.findById(id).select('password');
        if (!room) {
            return false;
        }

        return compare(password, room.password);
    }

    public async deleteRoom(id: string): Promise<void> {
        const room = await this.getRoom(id);
        if (room) {
            await room.remove();
        }
    }

    public async createRoom(name: string, owner: string, password?: string): Promise<RoomDocument> {
        if (password) {

            if (await this.usersService.checkUserPassword(owner, password)) {
                throw new ConflictException('password');
            }

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
