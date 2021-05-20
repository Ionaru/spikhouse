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

    public readonly appLogo = faTv;
    public readonly userIcon = faUser;
    public readonly logoutIcon = faSignOutAlt;

    public readonly microphoneIcon = faMicrophone;
    public readonly microphoneDisabledIcon = faMicrophoneSlash;
    public readonly webcamIcon = faVideo;
    public readonly webcamDisabledIcon = faVideoSlash;

    public microphoneEnabled = false;
    public webcamEnabled = false;

    public getUser(): IUser | undefined {
        return UserService.user;
    }

    public logout(): void {
        this.userService.logout();
    }

}
