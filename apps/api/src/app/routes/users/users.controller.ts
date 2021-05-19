import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, IUser } from '@spikhouse/api-interfaces';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    public constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    public getUsers(): Promise<IUser[]> {
        return this.usersService.getUsers();
    }

    @Post()
    public createUser(@Body() data: CreateUserDto): Promise<IUser> {
        return this.usersService.createUser(data.email, data.displayName, data.password);
    }
}
