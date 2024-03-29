import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import type { IMessage, IUser } from '@spikhouse/api-interfaces';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { SessionData } from 'express-session';
import { Server, Socket } from 'socket.io';

import { environment } from '../../../environments/environment';
import { AppModule } from '../../app.module';

import { RoomsService } from './rooms.service';

@WebSocketGateway()
export class RoomGateway {

    @WebSocketServer()
    private server?: Server;

    private readonly cookieName = environment.sessionName;
    private readonly cookieSecret = environment.sessionSecret;

    public constructor(
        private readonly roomsService: RoomsService,
    ) {}

    private static sanitizeUser(user: Partial<IUser>): Partial<IUser> {
        delete user.email;
        delete user.__v;
        delete user.createdAt;
        delete user.updatedAt;
        return user;
    }

    @SubscribeMessage('joinRoom')
    public async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: IMessage): Promise<void> {
        await this.validateSession(client.handshake.headers.cookie, data.sender._id);
        data.sender = RoomGateway.sanitizeUser(data.sender);

        const room = await this.roomsService.getRoom(data.content);
        if (!room) {
            throw new WsException('Invalid room');
        }

        if (room.hasPassword && (!data.password || !await this.roomsService.checkRoomPassword(data.content, data.password))) {
            throw new WsException('Invalid password');
        }

        client.to(data.content).emit('joinedRoom', data);
        client.join(data.content);

        const socketRoom = this.server?.sockets.adapter.rooms[data.content];
        if (socketRoom) {
            const payload: IMessage = {
                content: `${(socketRoom.length - 1)} other user(s) online.`,
                sender: {displayName: '-'},
                time: Date.now(),
            };
            client.emit('message', payload);
        }
    }

    @SubscribeMessage('message')
    public async message(@ConnectedSocket() client: Socket, @MessageBody() data: IMessage): Promise<void> {
        await this.validateSession(client.handshake.headers.cookie, data.sender._id);
        data.sender = RoomGateway.sanitizeUser(data.sender);

        Object.values(client.rooms).forEach((room) => client.to(room).emit('message', data));
    }

    private async validateSession(input: string, sender?: string): Promise<void> {
        const cookies = cookie.parse(input);
        const spikhouseCookie = cookies[this.cookieName];
        if (!spikhouseCookie) {
            throw new WsException('No cookie');
        }

        const cookieContents = cookieParser.signedCookie(spikhouseCookie, this.cookieSecret);
        if (!cookieContents) {
            throw new WsException('No cookie');
        }

        let session: SessionData;
        try {
            session = await AppModule.getSession(cookieContents);
        } catch (e) {
            throw new WsException(e);
        }

        if (session.user !== sender) {
            throw new WsException('Invalid session');
        }
    }

}
