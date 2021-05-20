import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { StatusCodes } from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UserService } from '../auth/user.service';

@Component({
    selector: 'spikhouse-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    public readonly emailProperty = 'email';
    public readonly passwordProperty = 'password';

    public readonly loadingIcon = faCircleNotch;

    public submitting = false;
    public loginError = '';

    public loginForm = new FormGroup({
        [this.emailProperty]: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),

        [this.passwordProperty]: new FormControl('', [
            Validators.required,
        ]),
    });

    public get email(): AbstractControl | null { return this.loginForm.get(this.emailProperty); }
    public get password(): AbstractControl | null { return this.loginForm.get(this.passwordProperty); }

    public constructor(
        private readonly router: Router,
        private readonly userService: UserService,
    ) {}

    public ngOnInit(): void {
        if (UserService.user) {
            this.router.navigate(['/inside']).then();
        }
    }

    public login(): void {
        this.submitting = true;
        this.loginError = '';
        this.userService.login(this.email?.value, this.password?.value).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(() => this.submitting = false),
        ).subscribe((response) => {
            this.userService.storeUser(response);
            this.router.navigate(['/inside']).then();
        });
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === StatusCodes.NOT_FOUND) {
            this.loginError = 'Unknown login.';
        }

        return throwError(this.loginError || error);
    }
}
