import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '@spikhouse/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    public constructor(private http: HttpClient) {}

    public createUser(email: string, displayName: string, password: string): Observable<IUser> {
        return this.http.post<IUser>('/api/users', {email, displayName, password});
    }

}
