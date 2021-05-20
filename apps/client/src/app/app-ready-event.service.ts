import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class AppReadyEventService {

    private static _appReadyObserver: Observer<void>;
    private static _appReadyEvent: Observable<void> = new Observable((observer: Observer<void>) => {
        AppReadyEventService._appReadyObserver = observer;
    });
    public static get appReadyEvent(): Observable<void> { return this._appReadyEvent; }

    private static _appReady = false;
    public static get appReady(): boolean { return this._appReady; }

    public triggerSuccess(): void {
        // If the app-ready event has already been triggered, just ignore any calls to trigger it again.
        if (AppReadyEventService._appReady) {
            return;
        }

        AppReadyEventService._appReady = true;
        AppReadyEventService._appReadyObserver.next(undefined);
        AppReadyEventService._appReadyObserver.complete();
    }

    public triggerFailure(detail: Error): void {
        // If the app-ready event has already been triggered, just ignore any calls to trigger it again.
        if (AppReadyEventService._appReady) {
            return;
        }

        AppReadyEventService._appReady = true;
        throw detail;
    }
}
