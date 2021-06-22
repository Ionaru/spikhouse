import { Component } from '@angular/core';
import {
    faMicrophone,
    faMicrophoneSlash, faSignOutAlt,
    faTv,
    faUser,
    faVideo,
    faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { IUser } from '@spikhouse/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from '../auth/user.service';

@Component({
    selector: 'spikhouse-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {

    public constructor(
        private readonly userService: UserService,
    ) {}

    private static _toggleAudioEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public static get toggleAudioEvent(): Observable<boolean> { return this._toggleAudioEvent.asObservable(); }

    private static _toggleVideoEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public static get toggleVideoEvent(): Observable<boolean> { return this._toggleVideoEvent.asObservable(); }

    public readonly appLogo = faTv;
    public readonly userIcon = faUser;
    public readonly logoutIcon = faSignOutAlt;

    public readonly microphoneIcon = faMicrophone;
    public readonly microphoneDisabledIcon = faMicrophoneSlash;
    public readonly webcamIcon = faVideo;
    public readonly webcamDisabledIcon = faVideoSlash;

    public microphoneEnabled = true;
    public webcamEnabled = true;

    public getUser(): IUser | undefined {
        return UserService.user;
    }

    public logout(): void {
        this.userService.logout();
    }

    public toggleAudio(): void {
        this.microphoneEnabled = !this.microphoneEnabled;
        NavbarComponent._toggleAudioEvent.next(this.microphoneEnabled);
    }

    public toggleVideo(): void {
        this.webcamEnabled = !this.webcamEnabled;
        NavbarComponent._toggleVideoEvent.next(this.webcamEnabled);
    }

}
