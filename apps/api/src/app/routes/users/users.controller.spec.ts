import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User, UserSchema } from '@spikhouse/api-interfaces';
import * as request from 'supertest';

import { closeInMongodbConnections, rootMongooseTestModule } from '../../../tests/tests.utils';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {

    let app: INestApplication;
    let usersController: UsersController;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: User.name, schema: UserSchema},
                ]),
            ],
            providers: [UsersService],
        }).compile();
        app = moduleRef.createNestApplication();
        usersController = moduleRef.get(UsersController);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    afterAll(async () => {
        await closeInMongodbConnections();
    });

    describe('/GET users', () => {
        it('returns an empty list when DB is empty', async () => {
            expect.assertions(2);
            const result = await request(app.getHttpServer()).get('/users');
            expect(result.statusCode).toStrictEqual(200);
            expect(result.body).toStrictEqual([]);
        });

        it('returns a list of users', async () => {
            expect.assertions(9);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            await usersController.createUser({email, displayName, password});

            const result = await request(app.getHttpServer()).get('/users');
            expect(result.statusCode).toStrictEqual(200);
            expect(result.body).toHaveLength(1);

            const user = result.body[0];
            expect(user._id).toBeDefined();
            expect(user.__v).toBeDefined();
            expect(user.createdAt).toBeDefined();
            expect(user.updatedAt).toBeDefined();
            expect(user.email).toStrictEqual(email);
            expect(user.displayName).toStrictEqual(displayName);
            // Password should never be returned (even in hashed form).
            expect(user.password).toBeUndefined();
        });
    });

    describe('/POST users', () => {
        it('returns an empty list when DB is empty', async () => {
            expect.assertions(8);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            const result = await request(app.getHttpServer()).post('/users').send({email, displayName, password});
            expect(result.statusCode).toStrictEqual(201);
            expect(result.body._id).toBeDefined();
            expect(result.body.__v).toBeDefined();
            expect(result.body.createdAt).toBeDefined();
            expect(result.body.updatedAt).toBeDefined();
            expect(result.body.email).toStrictEqual(email);
            expect(result.body.displayName).toStrictEqual(displayName);
            // Password should never be returned (even in hashed form).
            expect(result.body.password).toBeUndefined();
        });

        it('returns 409 conflict when user email is taken', async () => {
            expect.assertions(4);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            await usersController.createUser({email, displayName, password});
            await expect(usersController.getUsers()).resolves.toHaveLength(1);
            const result = await request(app.getHttpServer()).post('/users').send({email, displayName, password});
            expect(result.statusCode).toStrictEqual(409);
            expect(result.body).toStrictEqual({
                error: 'Conflict',
                message: email,
                statusCode: 409,
            });
            // User should not have been created.
            await expect(usersController.getUsers()).resolves.toHaveLength(1);
        });
    });
});
