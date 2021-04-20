import { Controller, Get } from '@nestjs/common';
import { IMessage } from '@spikhouse/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
    public constructor(private readonly appService: AppService) {}

    @Get('hello')
    public getData(): IMessage {
        return this.appService.getData();
    }
}
