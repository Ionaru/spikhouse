import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '@spikhouse/api-interfaces';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class UserService {

    private static _user?: IUser;
    public static get user(): IUser | undefined { return this._user; }

    public constructor(private http: HttpClient) {}

    public createUser(email: string, displayName: string, password: string): Observable<IUser> {
        return this.http.post<IUser>('/api/users', {email, displayName, password});
    }

    public login(email: string, password: string): Observable<IUser> {
        return this.http.post<IUser>('/api/auth', {email, password});
    }

    public logout(): void {
        this.http.delete('/api/auth')
            .pipe(finalize(() => window.location.reload()))
            .subscribe();
    }

    public storeUser(user: IUser): void {
        UserService._user = user;
    }

    public clearUser(): void {
        UserService._user = undefined;
    }

}
