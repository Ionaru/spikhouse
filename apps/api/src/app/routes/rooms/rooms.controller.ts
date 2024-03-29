import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreateRoomDto, IRoom, RoomPasswordDto } from '@spikhouse/api-interfaces';
import { Request } from 'express';

import { AuthGuard } from '../../guards/auth.guard';

import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {

    public constructor(
        private readonly roomsService: RoomsService,
    ) {}

    @Get()
    public async getRooms(): Promise<IRoom[]> {
        return this.roomsService.getRooms();
    }

    @Get(':id')
    public async getRoom(@Param() params: { id: string }): Promise<IRoom> {
        const room = await this.roomsService.getRoom(params.id);
        if (!room) {
            throw new NotFoundException(params.id);
        }
        return room;
    }

    @Post(':id')
    public async testRoomPassword(@Param() params: { id: string }, @Body() data: RoomPasswordDto): Promise<boolean> {
        return this.roomsService.checkRoomPassword(params.id, data.password);
    }

    @Post()
    public async createRoom(@Req() request: Request, @Body() data: CreateRoomDto): Promise<IRoom> {
        if (!request.session.user) {
            throw new ForbiddenException();
        }
        return this.roomsService.createRoom(data.name, request.session.user, data.password);
    }

    @Delete(':id')
    public async deleteRoom(@Req() request: Request, @Param() params: { id: string }): Promise<void> {
        const roomToDelete = await this.roomsService.getRoom(params.id);
        if (!roomToDelete) {
            return;
        }

        if (request.session.user !== roomToDelete.owner.toString()) {
            throw new ForbiddenException();
        }

        await this.roomsService.deleteRoom(roomToDelete.id);
    }

}
