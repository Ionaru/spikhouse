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

    public createRoom(name: string, password?: string): Observable<IRoom> {
        return this.http.post<IRoom>('/api/rooms', {name, password, owner: UserService.user});
    }

    public getRooms(): Observable<IRoom[]> {
        return this.http.get<IRoom[]>('/api/rooms');
    }

    public getRoom(id: string): Observable<IRoom> {
        return this.http.get<IRoom>(`/api/rooms/${id}`);
    }

    public deleteRoom(id: string): Observable<unknown> {
        return this.http.delete(`/api/rooms/${id}`);
    }
}
