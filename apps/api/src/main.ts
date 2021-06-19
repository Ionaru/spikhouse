import { format } from 'util';

import { Logger, ValidationPipe } from '@nestjs/common';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const getLoggingLevel = (): LogLevel[] => {
    const env = process.env.SPIKHOUSE_API_LOGGING;
    if (!env) {
        return ['error', 'warn'];
    }

    return env.split(',').map((level) => level.trim()) as LogLevel[];
};

const bootstrap = async () => {

    const app = await NestFactory.create(AppModule, {
        logger: getLoggingLevel(),
    });

    app.useGlobalPipes(new ValidationPipe());

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.use(
        session({
            cookie: {
                maxAge: 604_800_000, // 7 days
            },
            name: environment.sessionName,
            resave: false,
            saveUninitialized: false,
            secret: environment.sessionSecret,
            store: AppModule.mongoStore,
        }),
    );

    const port = process.env.SPIKHOUSE_API_PORT || 3333;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
    });
};

bootstrap().catch((error) => {
    process.stderr.write(`${format(error)}\n`);
    process.exit(1);
});
