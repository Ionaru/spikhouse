import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserDto, IUser, LoginDto } from '@spikhouse/api-interfaces';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class UserService {

    private static _user?: IUser;
    public static get user(): IUser | undefined { return this._user; }

    public constructor(
        private readonly http: HttpClient,
    ) {}

    public createUser(email: string, displayName: string, password: string): Observable<IUser> {
        const data: CreateUserDto = {email, displayName, password};
        return this.http.post<IUser>('/api/users', data);
    }

    public login(email: string, password: string): Observable<IUser> {
        const data: LoginDto = {email, password};
        return this.http.post<IUser>('/api/auth', data);
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
