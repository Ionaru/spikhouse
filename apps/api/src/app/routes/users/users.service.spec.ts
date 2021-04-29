import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoError } from 'mongodb';

import { User } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    const userOne = new User('test@example.com');
    const userTwo = new User('spam@example.com');

    function mockedUserModel(this: any, doc: any) {
        this.data = doc;
        this.email = this.data.email;
        this.save = jest.fn().mockResolvedValue(new User(this.data.email));
    }
    mockedUserModel.find = jest.fn().mockResolvedValue([userOne, userTwo]);

    const createTestUsersService = async (mockedUserModelValue: (this: any, doc: any) => void): Promise<UsersService> => {
        const app = await Test.createTestingModule({
            providers: [UsersService, {
                provide: getModelToken(User.constructor.name),
                useValue: mockedUserModelValue,
            }],
        }).compile();

        return app.get(UsersService);
    };

    beforeAll(async () => {
        service = await createTestUsersService(mockedUserModel);
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            expect.assertions(1);
            await expect(service.getUsers()).resolves.toStrictEqual([
                userOne, userTwo,
            ]);
        });
    });

    describe('createUser', () => {
        it('should create and return a user', async () => {
            expect.assertions(1);
            const email = 'new@example.com';
            const user = await service.createUser(email);
            expect(user.email).toStrictEqual(email);
        });

        it('should throw a ConflictException', async () => {
            expect.assertions(1);

            const error = new MongoError('Test error!');
            error.code = 11000;

            service = await createTestUsersService(function(this: any, doc: any) {
                this.data = doc;
                this.save = jest.fn().mockRejectedValueOnce(error);
            });

            const email = 'moo@example.com';
            await expect(service.createUser(email)).rejects.toStrictEqual(new ConflictException(email));
        });

        it('should re-throw unknown mongo exceptions', async () => {
            expect.assertions(1);

            const error = new MongoError('Unknown error!');
            error.code = 11001;

            service = await createTestUsersService(function(this: any, doc: any) {
                this.data = doc;
                this.save = jest.fn().mockRejectedValueOnce(error);
            });

            const email = 'shiny@example.com';
            await expect(service.createUser(email)).rejects.toStrictEqual(new MongoError('Unknown error!'));
        });

        it('should re-throw unknown generic exceptions', async () => {
            expect.assertions(1);

            const error = new Error('Panic!');

            service = await createTestUsersService(function(this: any, doc: any) {
                this.data = doc;
                this.save = jest.fn().mockRejectedValueOnce(error);
            });

            const email = 'shiny@example.com';
            await expect(service.createUser(email)).rejects.toStrictEqual(new Error('Panic!'));
        });
    });
});
