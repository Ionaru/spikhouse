import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { StatusCodes } from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { RoomsService } from '../rooms.service';

@Component({
    selector: 'spikhouse-create-room',
    styleUrls: ['./create-room.component.scss'],
    templateUrl: './create-room.component.html',
})
export class CreateRoomComponent {

    public readonly nameProperty = 'roomName';
    public readonly passwordProperty = 'roomPassword';

    public readonly loadingIcon = faCircleNotch;

    public submitting = false;
    public createError = '';

    public createRoomForm = new FormGroup({
        [this.nameProperty]: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),

        [this.passwordProperty]: new FormControl('', [
            Validators.minLength(3),
        ]),
    });

    public get name(): AbstractControl | null { return this.createRoomForm.get(this.nameProperty); }
    public get password(): AbstractControl | null { return this.createRoomForm.get(this.passwordProperty); }

    public constructor(
        private readonly roomsService: RoomsService,
        private readonly router: Router,
    ) { }

    public create(): void {
        this.submitting = true;
        this.createError = '';
        this.roomsService.createRoom(this.name?.value, this.password?.value || undefined).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(() => this.submitting = false),
        ).subscribe((response) => {
            this.router.navigate([`/room/${response._id}`]).then();
        });
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        this.createError = 'Unknown error, please try again later.';
        if (error.status === StatusCodes.CONFLICT) {
            this.createError = 'You can not re-use your account password.';
        } else {
            return throwError(error);
        }

        return throwError(this.createError);
    }

}
