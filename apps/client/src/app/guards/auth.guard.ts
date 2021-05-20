import { Injectable } from '@angular/core';


import { UserService } from '../auth/user.service';

import { BaseGuard } from './base.guard';

@Injectable()
export class AuthGuard extends BaseGuard {

    public condition(): boolean {
        return !!UserService.user;
    }
}
