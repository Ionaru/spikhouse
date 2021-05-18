import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UserService } from '../user.service';

@Component({
    selector: 'spikhouse-register',
    styleUrls: ['./register.component.scss'],
    templateUrl: './register.component.html',
})
export class RegisterComponent {

    public readonly displayNameProperty = 'displayName';
    public readonly emailProperty = 'email';
    public readonly passwordProperty = 'password';

    public registerForm = new FormGroup({
        [this.displayNameProperty]: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),

        [this.emailProperty]: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),

        [this.passwordProperty]: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    public get displayName(): AbstractControl | null { return this.registerForm.get(this.displayNameProperty); }
    public get email(): AbstractControl | null { return this.registerForm.get(this.emailProperty); }
    public get password(): AbstractControl | null { return this.registerForm.get(this.passwordProperty); }

    public submitting = false;
    public error = '';

    public constructor(
        private readonly userService: UserService,
    ) {}

    public onSubmit(): void {
        this.submitting = true;
        this.userService.createUser(this.email?.value, this.displayName?.value, this.password?.value)
            .pipe(
                catchError((error: HttpErrorResponse) => this.handleError(error)),
                finalize(() => this.submitting = false),
            )
            .subscribe((user) => {
                // eslint-disable-next-line no-console
                console.log('Created user!', user);
            });
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === StatusCodes.CONFLICT) {
            this.error = 'Email is already in use.';
        }

        return throwError('Error while creating user.');
    }
}
