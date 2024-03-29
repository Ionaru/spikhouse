import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRoom } from '@spikhouse/api-interfaces';
import { Observable } from 'rxjs';

import { UserService } from '../auth/user.service';

@Injectable()
export class RoomsService {
    public constructor(
        private readonly http: HttpClient,
    ) {}

    public createRoom(roomName: string, password?: string): Observable<IRoom> {
        return this.http.post<IRoom>('/api/rooms', {name: roomName, password, owner: UserService.user});
    }

    public getRooms(): Observable<IRoom[]> {
        return this.http.get<IRoom[]>('/api/rooms');
    }

    public getRoom(id: string): Observable<IRoom> {
        return this.http.get<IRoom>(`/api/rooms/${id}`);
    }

    public testRoomPassword(id: string, password: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/rooms/${id}`, {password});
    }

    public deleteRoom(id: string): Observable<unknown> {
        return this.http.delete(`/api/rooms/${id}`);
    }
}
