import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IUser } from '@spikhouse/api-interfaces';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppReadyEventService } from './app-ready-event.service';
import { UserService } from './auth/user.service';

@Component({
    selector: 'spikhouse-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {

    public constructor(
        private readonly appReadyEvent: AppReadyEventService,
        private readonly http: HttpClient,
        private readonly userService: UserService,
    ) {
        this.boot();
    }

    private boot(): Subscription {
        return this.shakeHands()
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.appReadyEvent.triggerFailure(error);
                    return throwError(error);
                }),
            )
            .subscribe(async (response) => {
                this.userService.storeUser(response);
                this.appReadyEvent.triggerSuccess();
            });
    }

    private shakeHands() {
        return this.http.get<IUser>('api/auth');
    }
}
