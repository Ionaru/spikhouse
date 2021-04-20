import { Injectable } from '@nestjs/common';
import { IMessage } from '@spikhouse/api-interfaces';

@Injectable()
export class AppService {
    public getData(): IMessage {
        return {message: 'Welcome to api!'};
    }
}
