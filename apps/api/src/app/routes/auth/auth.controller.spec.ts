import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { SessionModule } from 'nestjs-session';
import * as request from 'supertest';

import { rootMongooseTestModule } from '../../../tests/tests.utils';
import { User, UserSchema } from '../users/user.schema';
import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';

describe('AuthController', () => {

    let app: INestApplication;
    // let authController: AuthController;
    let usersService: UsersService;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    {name: User.name, schema: UserSchema},
                ]),
                SessionModule.forRoot({session: {secret: 'test', resave: false, saveUninitialized: false}}),
            ],
            providers: [UsersService],
        }).compile();
        app = moduleRef.createNestApplication();
        usersService = moduleRef.get(UsersService);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/GET auth', () => {
        it('returns nothing when no cookie is set', async () => {
            expect.assertions(2);
            const result = await request(app.getHttpServer()).get('/auth');
            expect(result.statusCode).toStrictEqual(200);
            expect(result.body).toStrictEqual({});
        });
    });

    describe('/POST auth', () => {
        it('allows user to log in', async () => {
            expect.assertions(8);
            const email = 'new@example.com';
            const displayName = 'newUser';
            const password = 'ThisIsAPassword';
            await usersService.createUser(email, displayName, password);
            const result = await request(app.getHttpServer()).post('/auth').send({email, password});
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
    });

    describe('/DELETE auth', () => {
        it('always succeeds', async () => {
            expect.assertions(2);
            const result = await request(app.getHttpServer()).delete('/auth');
            expect(result.statusCode).toStrictEqual(200);
            expect(result.body).toStrictEqual({});
        });
    });
});
