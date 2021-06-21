import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import type {
    IDisconnectMessage,
    IIceCandidateMessage,
    IInitCallMessage,
    IIsCallActiveMessage,
    IRequestOfferMessage,
    ISessionDescriptionMessage,
    IUser,
} from '@spikhouse/api-interfaces';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { SessionData } from 'express-session';
import { Server, Socket } from 'socket.io';

import { environment } from '../../../environments/environment';
import { AppModule } from '../../app.module';
import { RoomsService } from '../rooms/rooms.service';

type RoomId = string;

@WebSocketGateway()
export class CallsGateway {
    @WebSocketServer()
    protected server?: Server;
    protected presenters: Record<RoomId, Socket> = {};
    protected waitingForOffer: Record<Socket['id'], Socket> = {};

    protected readonly cookieName = environment.sessionName;
    protected readonly cookieSecret = environment.sessionSecret;

    public constructor(protected readonly roomsService: RoomsService) {}

    protected static sanitizeUser(user: Partial<IUser>): Partial<IUser> {
        delete user.__v;
        delete user.email;
        delete user.createdAt;
        delete user.updatedAt;
        return user;
    }

    @SubscribeMessage('isCallActive')
    public async isCallActive(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IIsCallActiveMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        client.emit(
            'isCallActiveResponse',
            typeof this.presenters[data.room] !== 'undefined',
        );
    }

    @SubscribeMessage('initCall')
    public async initCall(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IInitCallMessage,
    ): Promise<void> {
        const senderId = await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);
        const room = await this.roomsService.getRoom(data.room);
        if (room?.owner.toString() !== senderId) {
            throw new WsException('Not the Presenter');
        }

        this.presenters[data.room] = client;
    }

    @SubscribeMessage('offer')
    public async respondOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: ISessionDescriptionMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        const receiver = this.waitingForOffer[data.rid];
        receiver.emit('offerResponse', data);
        delete this.waitingForOffer[data.rid];
    }

    @SubscribeMessage('broadcastOffer')
    public async startBroadCast(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: ISessionDescriptionMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        client.to(data.room).emit('offerResponse', data);
    }

    @SubscribeMessage('requestOffer')
    public async requestOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IRequestOfferMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        data.rid = client.id;
        this.waitingForOffer[client.id] = client;
        const receiver = this.presenters[data.room];

        receiver.emit('requestOfferResponse', data);
    }

    @SubscribeMessage('answer')
    public async answer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: ISessionDescriptionMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        const receiver = this.presenters[data.room];
        receiver.emit('answerResponse', data);
    }

    @SubscribeMessage('offerIceCandidate')
    public async offerIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IIceCandidateMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        client.to(data.room).emit('offerIceCandidateResponse', data);
    }

    @SubscribeMessage('answerIceCandidate')
    public async answerIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IIceCandidateMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        const receiver = this.presenters[data.room];
        receiver.emit('answerIceCandidateResponse', data);
    }

    @SubscribeMessage('disconnectCall')
    public async disconnect(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: IDisconnectMessage,
    ): Promise<void> {
        await this.validateSession(
            client.handshake.headers.cookie,
            data.sender._id,
        );
        data.sender = CallsGateway.sanitizeUser(data.sender);

        client.to(data.room).emit('disconnectCallResponse');
        delete this.presenters[data.room];
    }

    protected async validateSession(
        input: string,
        sender?: string,
    ): Promise<string> {
        const cookies = cookie.parse(input);
        const spikhouseCookie = cookies[this.cookieName];
        if (!spikhouseCookie) {
            throw new WsException('No cookie');
        }

        const cookieContents = cookieParser.signedCookie(
            spikhouseCookie,
            this.cookieSecret,
        );
        if (!cookieContents) {
            throw new WsException('No cookie');
        }

        let session: SessionData;
        try {
            session = await AppModule.getSession(cookieContents);
        } catch (e) {
            throw new WsException(e);
        }

        if (typeof sender === 'undefined' || session.user !== sender) {
            throw new WsException('Invalid session');
        }

        return sender;
    }
}
