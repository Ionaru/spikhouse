import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { IMessage } from '@spikhouse/api-interfaces';
import { StatusCodes } from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as io from 'socket.io-client';

import { UserService } from '../../auth/user.service';
import { RoomsService } from '../rooms.service';

import Socket = SocketIOClient.Socket;

@Component({
    selector: 'spikhouse-room',
    styleUrls: ['./room.component.scss'],
    templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit, OnDestroy {

    public roomId!: string;
    public socket!: Socket;

    public connected = false;
    public needsPassword = false;
    public passwordError = '';
    public submitting = false;

    public messages: IMessage[] = [];
    public message = '';

    public readonly loadingIcon = faCircleNotch;

    public user = UserService.user;

    public readonly passwordProperty = 'roomPassword';
    public roomPasswordForm = new FormGroup({
        [this.passwordProperty]: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    });
    public get password(): AbstractControl | null { return this.roomPasswordForm.get(this.passwordProperty); }

    public constructor(
        private readonly roomsService: RoomsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) { }

    public ngOnDestroy(): void {
        this.socket?.disconnect();
    }

    public async ngOnInit(): Promise<void> {
        // Get the room id from the current route.
        const routeParams = this.route.snapshot.paramMap;
        const roomId = routeParams.get('roomId');
        if (!roomId) {
            return this.handleRoomNotFound();
        }

        this.roomsService.getRoom(roomId)
            .pipe(
                catchError((error: HttpErrorResponse) => this.handleError(error)),
            )
            .subscribe((room) => {
                this.roomId = roomId;
                this.needsPassword = room.hasPassword;
                if (!this.needsPassword) {
                    this.connectSocket();
                }
            });
    }

    public checkPassword(): void {
        this.submitting = true;
        this.passwordError = '';
        this.roomsService.testRoomPassword(this.roomId, this.password?.value).pipe(
        // this.userService.login(this.email?.value, this.password?.value).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(() => this.submitting = false),
        ).subscribe((correct) => {
            if (!correct) {
                this.passwordError = 'Password incorrect';
            } else {
                this.connectSocket();
            }
        });
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === StatusCodes.NOT_FOUND) {
            this.handleRoomNotFound();
        }

        return throwError(error);
    }

    public handleRoomNotFound(): void {
        this.router.navigate(['/rooms']).then();
    }

    public connectSocket(): void {
        this.socket = io();
        this.socket.on('connect', () => {
            if (UserService.user) {
                const payload: IMessage = {content: this.roomId, sender: UserService.user, time: Date.now()};
                if (this.needsPassword) {
                    payload.password = this.password?.value;
                }
                this.socket.emit('joinRoom', payload);
                payload.content = 'Connected';
                this.messages.push(payload);
                this.connected = true;
            }
        });

        this.socket.on('message', (message: IMessage) => {
            this.messages.push(message);
        });

        this.socket.on('joinedRoom', (message: IMessage) => {
            message.content = 'Joined the room';
            this.messages.push(message);
        });
    }

    public sendMessage(message: string): void {
        if (UserService.user && message) {
            const payload: IMessage = {content: message, sender: UserService.user, time: Date.now()};
            this.messages.push(payload);
            this.socket.emit('message', payload);
            this.message = '';
        }
    }

}
