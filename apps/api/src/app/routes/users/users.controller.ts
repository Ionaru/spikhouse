import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, IUser } from '@spikhouse/api-interfaces';

import { DevelopmentGuard } from '../../guards/development.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    public constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    @UseGuards(DevelopmentGuard)
    public async getUsers(): Promise<IUser[]> {
        return this.usersService.getUsers();
    }

    @Post()
    public createUser(@Body() data: CreateUserDto): Promise<IUser> {
        return this.usersService.createUser(data.email, data.displayName, data.password);
    }

    @Delete(':email')
    @UseGuards(DevelopmentGuard)
    public async deleteUsers(@Param() params: {email: string}): Promise<void> {
        return this.usersService.deleteUser(params.email);
    }
}
