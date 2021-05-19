import { ConflictException, NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { rootMongooseTestModule } from '../../../tests/tests.utils';

import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;
    let app: TestingModule;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: User.constructor.name, schema: UserSchema},
                ]),
            ],
            providers: [UsersService],
        }).compile();

        service = app.get(UsersService);
    });

    afterEach(async () => {
        await app.close();
    });

    describe('getUser', () => {
        it('throws NotFoundException on unknown id', async () => {
            expect.assertions(1);
            const id = Types.ObjectId().toHexString();
            await expect(service.getUser(id)).rejects.toStrictEqual(new NotFoundException(id));
        });

        it('returns a user correctly', async () => {
            expect.assertions(3);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            const user = await service.createUser(email, displayName, password);
            const fetchedUser = await service.getUser(user._id);
            expect(fetchedUser.email).toStrictEqual(email);
            expect(fetchedUser.displayName).toStrictEqual(displayName);
            // Password should never be returned (even in hashed form).
            expect(fetchedUser.password).toBeUndefined();
        });
    });

    describe('getUsers', () => {
        it('returns an empty list when DB is empty', async () => {
            expect.assertions(1);
            await expect(service.getUsers()).resolves.toStrictEqual([]);
        });
    });

    describe('createUser', () => {
        it('should create and return a user', async () => {
            expect.assertions(3);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            const user = await service.createUser(email, displayName, password);
            expect(user.email).toStrictEqual(email);
            expect(user.displayName).toStrictEqual(displayName);
            // Password should never be returned (even in hashed form).
            expect(user.password).toBeUndefined();
        });

        it('should throw a ConflictException', async () => {
            expect.assertions(1);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            await service.createUser(email, displayName, password);
            await expect(service.createUser(email, displayName, password)).rejects.toStrictEqual(new ConflictException(email));
        });

    });
});
