import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { AppReadyEventService } from '../app-ready-event.service';

@Injectable()
export class BaseGuard implements CanActivate {

    public constructor(
        private readonly router: Router,
        private readonly ngZone: NgZone,
    ) { }

    public condition(): boolean {
        return false;
    }

    public navigateToHome(): void {
        this.ngZone.run(() => this.router.navigate(['/'])).then();
    }

    // This guard will redirect to '/' when its condition is not met.
    public canActivate(): Observable<boolean> | boolean {

        if (AppReadyEventService.appReady) {
            if (this.condition()) {
                return true;
            } else {
                this.navigateToHome();
                return false;
            }
        } else {
            return new Observable((observer: Observer<boolean>) => {
                AppReadyEventService.appReadyEvent.subscribe(() => {
                    if (this.condition()) {
                        observer.next(true);
                    } else {
                        this.navigateToHome();
                        observer.next(false);
                    }
                    observer.complete();
                });
            });
        }
    }
}
