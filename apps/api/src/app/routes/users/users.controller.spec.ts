import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let app: TestingModule;

    const userOne = new User('test@example.com');
    const userTwo = new User('spam@example.com');

    beforeAll(async () => {

        function mockedUserModel(this: any, doc: any) {
            this.data = doc;
            this.email = this.data.email;
            this.save = jest.fn().mockResolvedValue(this.data);
        }
        mockedUserModel.find = jest.fn().mockResolvedValue([userOne, userTwo]);

        app = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, {
                provide: getModelToken(User.constructor.name),
                useValue: mockedUserModel,
            }],
        }).compile();
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            expect.assertions(1);
            const appController = app.get(UsersController);
            await expect(appController.getUsers()).resolves.toStrictEqual([
                userOne, userTwo,
            ]);
        });
    });

    describe('createUser', () => {
        it('should create and return a user', async () => {
            expect.assertions(1);
            const appController = app.get(UsersController);
            const email = 'new@example.com';
            const user = await appController.createUser({email});
            expect(user.email).toStrictEqual(email);
        });
    });
});
