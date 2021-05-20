import { CanActivate, Injectable } from '@nestjs/common';

import { environment } from '../../environments/environment';

@Injectable()
export class DevelopmentGuard implements CanActivate {
    public canActivate(): boolean {
        return !environment.production;
    }
}
