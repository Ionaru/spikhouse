import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '@spikhouse/api-interfaces';

import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller()
export class UsersController {

    public constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('users')
    public getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }

    @Post('users')
    public createUser(@Body() data: CreateUserDto): Promise<User> {
        return this.usersService.createUser(data.email);
    }
}
