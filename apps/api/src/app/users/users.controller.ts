import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '@spikhouse/api-interfaces';

import { UserSchema } from './user.schema';
import { UsersService } from './users.service';

@Controller()
export class UsersController {

    public constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('users')
    public getUsers(): Promise<UserSchema[]> {
        return this.usersService.getUsers();
    }

    @Post('users')
    public createUser(@Body() data: CreateUserDto): Promise<UserSchema> {
        return this.usersService.createUser(data.email);
    }
}
