import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { IRoom } from '@spikhouse/api-interfaces';

import { UserService } from '../auth/user.service';

import { RoomsService } from './rooms.service';

@Component({
    selector: 'spikhouse-rooms',
    styleUrls: ['./rooms.component.scss'],
    templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit {

    public constructor(
        private readonly roomsService: RoomsService,
        private readonly router: Router,
    ) {}

    public rooms: IRoom[] = [];

    public user = UserService.user;

    public readonly passwordIcon = faLock;

    public async ngOnInit(): Promise<void> {
        this.roomsService.getRooms().subscribe((result) => {
            this.rooms = result;
        });
    }

    public async deleteRoom(id: string): Promise<void> {
        this.roomsService.deleteRoom(id).subscribe(() => this.ngOnInit());
    }

    public async createRoom(): Promise<void> {
        this.router.navigate(['/rooms/create']).then();
    }
}
