import { Component } from '@angular/core';
import {
    faMicrophone,
    faMicrophoneSlash,
    faTv,
    faUser,
    faVideo,
    faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'spikhouse-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {

    public readonly appLogo = faTv;
    public readonly userIcon = faUser;

    public readonly microphoneIcon = faMicrophone;
    public readonly microphoneDisabledIcon = faMicrophoneSlash;
    public readonly webcamIcon = faVideo;
    public readonly webcamDisabledIcon = faVideoSlash;

    public microphoneEnabled = false;
    public webcamEnabled = false;

}
