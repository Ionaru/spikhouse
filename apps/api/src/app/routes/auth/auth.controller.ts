import { Body, Controller, Delete, Get, NotFoundException, Post, Req } from '@nestjs/common';
import { IUser, LoginDto } from '@spikhouse/api-interfaces';
import { Request } from 'express';

import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {

    public constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    public async shakeHands(@Req() request: Request): Promise<IUser | void> {
        if (request.session.user) {
            let user: IUser | null;
            try {
                user = await this.usersService.getUser(request.session.user);
            } catch {
                return;
            }

            if (user) {
                return user;
            }
        }
    }

    @Post()
    public async login(@Req() request: Request, @Body() data: LoginDto): Promise<IUser | void> {
        const user = await this.usersService.getUserByEmail(data.email);
        if (!user) {
            throw new NotFoundException();
        }

        if (await this.usersService.checkUserPassword(user._id, data.password)) {
            request.session.user = user.id;
            return user;
        } else {
            throw new NotFoundException();
        }
    }

    @Delete()
    public async logout(@Req() request: Request): Promise<void> {
        delete request.session.user;
    }
}
