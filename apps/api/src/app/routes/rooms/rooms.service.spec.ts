import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Room, RoomSchema, User, UserDocument, UserSchema } from '@spikhouse/api-interfaces';
import { Types } from 'mongoose';

import { closeInMongodbConnections, rootMongooseTestModule } from '../../../tests/tests.utils';
import { UsersService } from '../users/users.service';

import { RoomsService } from './rooms.service';

describe('RoomsService', () => {

    let service: RoomsService;
    let app: TestingModule;
    let user: UserDocument;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: Room.name, schema: RoomSchema},
                    {name: User.name, schema: UserSchema},
                ]),
            ],
            providers: [RoomsService, UsersService],
        }).compile();

        service = app.get(RoomsService);
        const userService = app.get(UsersService);
        user = await userService.createUser('test@example.com', 'Test', 'TestPassword');
    });

    afterEach(async () => {
        await app.close();
    });

    afterAll(async () => {
        await closeInMongodbConnections();
    });

    describe('getRoom', () => {
        it('returns null on unknown id', async () => {
            expect.assertions(1);
            const id = Types.ObjectId().toHexString();
            await expect(service.getRoom(id)).resolves.toBeNull();
        });

        it('returns a room correctly', async () => {
            expect.assertions(2);

            const roomName = 'TestRoom';
            const roomOwner = user.id;
            const room = await service.createRoom(roomName, roomOwner);

            const fetchedRoom = await service.getRoom(room.id);
            if (!fetchedRoom) {
                throw new Error('fetchedRoom does not exist!');
            }
            expect(fetchedRoom.name).toStrictEqual(roomName);
            expect(fetchedRoom.owner.toString()).toStrictEqual(roomOwner);
        });
    });

    describe('getRooms', () => {
        it('returns an empty list when DB is empty', async () => {
            expect.assertions(1);
            await expect(service.getRooms()).resolves.toStrictEqual([]);
        });

        it('returns a list of rooms', async () => {
            expect.assertions(4);

            const roomName = 'TestRoom';
            const roomOwner = user.id;
            await service.createRoom(roomName, roomOwner);

            const rooms = await service.getRooms();
            expect(rooms).toHaveLength(1);
            expect(rooms[0].name).toStrictEqual(roomName);
            expect(rooms[0].owner.toString()).toStrictEqual(roomOwner);
            expect(rooms[0].hasPassword).toStrictEqual(false);
        });
    });

    describe('deleteRoom', () => {
        it('does nothing (no error) on unknown id', async () => {
            expect.assertions(1);
            const id = Types.ObjectId().toHexString();
            await expect(service.deleteRoom(id)).resolves.toBeUndefined();
        });

        it('deletes the room correctly', async () => {
            expect.assertions(4);

            const assertRoomsAmount = async (amount: number): Promise<void> => {
                const rooms = await service.getRooms();
                expect(rooms).toHaveLength(amount);
            };
            await assertRoomsAmount(0);

            const roomName = 'TestRoom';
            const roomOwner = user.id;
            const room = await service.createRoom(roomName, roomOwner);

            await assertRoomsAmount(1);

            await expect(service.deleteRoom(room.id)).resolves.toBeUndefined();

            await assertRoomsAmount(0);
        });
    });

    describe('createRoom', () => {
        it('can create a room', async () => {
            expect.assertions(5);

            const roomName = 'TestRoom';
            const roomOwner = user.id;
            const roomPassword = 'password';
            await service.createRoom(roomName, roomOwner, roomPassword);

            const rooms = await service.getRooms();
            expect(rooms).toHaveLength(1);
            expect(rooms[0].name).toStrictEqual(roomName);
            expect(rooms[0].owner.toString()).toStrictEqual(roomOwner);
            expect(rooms[0].password).toBeUndefined();
            expect(rooms[0].hasPassword).toStrictEqual(true);
        });
    });

});
