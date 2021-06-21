import { HttpErrorResponse } from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import {
    IIceCandidateMessage,
    IMessage,
    IRequestOfferMessage,
    ISessionDescriptionMessage,
} from '@spikhouse/api-interfaces';
import { StatusCodes } from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as io from 'socket.io-client';

import { UserService } from '../../auth/user.service';
import { RoomsService } from '../rooms.service';

import { WebrtcService } from './webrtc.service';

import Socket = SocketIOClient.Socket;

@Component({
    selector: 'spikhouse-room',
    styleUrls: ['./room.component.scss'],
    templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit, OnDestroy, AfterViewInit {
    public roomId!: string;
    public roomName?: string;
    public socket!: Socket;

    public connected = false;
    public needsPassword = false;
    public passwordError = '';
    public submitting = false;

    public messages: IMessage[] = [];
    public message = '';

    public isOwner = false;
    public isPlaying = false;
    @ViewChild('videoElement')
    public videoElement: ElementRef<HTMLMediaElement> | null = null;
    public _videoStream: MediaStream;
    public set videoStream(stream: MediaStream) {
        this._videoStream = stream;
        if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = this.videoStream;
        }
    }

    public get videoStream(): MediaStream {
        return this._videoStream;
    }

    public readonly loadingIcon = faCircleNotch;

    public user = UserService.user;

    public readonly passwordProperty = 'roomPassword';
    public roomPasswordForm = new FormGroup({
        [this.passwordProperty]: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    });

    public get password(): AbstractControl | null {
        return this.roomPasswordForm.get(this.passwordProperty);
    }

    public constructor(
        private readonly roomsService: RoomsService,
        private readonly webrtcService: WebrtcService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) {
        this._videoStream = new MediaStream();
    }

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

        this.roomsService
            .getRoom(roomId)
            .pipe(
                catchError((error: HttpErrorResponse) =>
                    this.handleError(error),
                ),
            )
            .subscribe(async (room) => {
                this.roomId = roomId;
                this.roomName = room.name;
                this.needsPassword = room.hasPassword;

                if (!this.needsPassword) {
                    this.socket = await this.connectSocket();
                }

                this.isOwner = room.owner.toString() === UserService.user?._id;

                this.socket.on('message', (message: IMessage) => {
                    this.messages.push(message);
                });

                this.socket.on('joinedRoom', (message: IMessage) => {
                    message.content = 'Joined the room';
                    this.messages.push(message);
                });

                if (this.isOwner) {
                    this.setBroadcastListeners();
                } else {
                    this.setWatchListeners();
                }
            });
    }

    public ngAfterViewInit(): void {
        if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = this.videoStream;
        }
    }

    public checkPassword(): void {
        this.submitting = true;
        this.passwordError = '';
        this.roomsService.testRoomPassword(this.roomId, this.password?.value).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(() => this.submitting = false),
        ).subscribe((correct) => {
            if (!correct) {
                this.passwordError = 'Password incorrect';
            } else {
                this.connectSocket().then();
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

    public async connectSocket(): Promise<Socket> {
        return new Promise((res) => {
            const socket = io();
            socket.on('connect', () => {
                if (UserService.user) {
                    const payload: IMessage = {
                        content: this.roomId,
                        sender: UserService.user,
                        time: Date.now(),
                    };
                    if (this.needsPassword) {
                        payload.password = this.password?.value;
                    }
                    socket.emit('joinRoom', payload);
                    payload.content = 'Connected';
                    this.messages.push(payload);
                    this.connected = true;
                    res(socket);
                }
            });
        });
    }

    public sendMessage(message: string): void {
        if (UserService.user && message) {
            const payload: IMessage = {
                content: message,
                sender: UserService.user,
                time: Date.now(),
            };
            this.messages.push(payload);
            this.socket.emit('message', payload);
            this.message = '';
        }
    }

    public async broadcast(): Promise<void> {
        this.isPlaying = true;
        this.videoStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });

        if (this.videoStream === null) {
            throw new Error('Unable to get user media');
        } else {
            this.webrtcService.setStream(this.videoStream);
        }

        this.socket.emit('initCall', {
            room: this.roomId,
            sender: UserService.user,
        });

        const offer = await this.webrtcService.createOffer();
        this.socket.emit('broadcastOffer', {
            room: this.roomId,
            sdp: offer.sdp,
            sender: UserService.user,
            type: offer.type,
        });
    }

    public async disconnect(): Promise<void> {
        this.isPlaying = false;
        if (this.videoElement) {
            this.videoStream?.getTracks().forEach((track) => {
                track.stop();
            });

            this.videoStream = new MediaStream();
            this.videoElement.nativeElement.srcObject = null;
            this.webrtcService.createPeerConnection();

            this.socket.emit('disconnectCall', {
                room: this.roomId,
                sender: UserService.user,
            });
        }
    }

    public async watch(): Promise<void> {
        this.isPlaying = true;
        this.videoStream = new MediaStream();

        this.socket.emit('isCallActive', {
            room: this.roomId,
            sender: UserService.user,
        });
    }

    protected setBroadcastListeners(): void {
        this.webrtcService.setOnIceCandidate((e) => {
            if (e.candidate) {
                this.socket.emit('offerIceCandidate', {
                    ...e.candidate.toJSON(),
                    room: this.roomId,
                    sender: UserService.user,
                });
            }
        });

        this.socket.on(
            'requestOfferResponse',
            async (message: IRequestOfferMessage) => {
                const offer = await this.webrtcService.createOffer();
                this.socket.emit('offer', {
                    rid: message.rid,
                    room: this.roomId,
                    sdp: offer.sdp,
                    sender: UserService.user,
                    type: offer.type,
                });
            },
        );

        this.socket.on(
            'answerResponse',
            async (message: ISessionDescriptionMessage) => {
                await this.webrtcService.setRemoteDescriptionFromAnswer({
                    sdp: message.sdp,
                    type: message.type,
                });
            },
        );

        this.socket.on(
            'answerIceCandidateResponse',
            async (message: IIceCandidateMessage) => {
                await this.webrtcService.addIceCandidate(message);
            },
        );
    }

    protected setWatchListeners(): void {
        this.webrtcService.setOnIceCandidate((e) => {
            if (e.candidate) {
                this.socket.emit('answerIceCandidate', {
                    ...e.candidate.toJSON(),
                    room: this.roomId,
                    sender: UserService.user,
                });
            }
        });

        this.socket.on('isCallActiveResponse', (message: boolean) => {
            if (message) {
                this.socket.emit('requestOffer', {
                    room: this.roomId,
                    sender: UserService.user,
                });
            }
        });

        this.socket.on(
            'offerResponse',
            async (message: ISessionDescriptionMessage) => {
                if (this.isPlaying) {
                    const answer = await this.webrtcService.createAnswer(
                        this.videoStream,
                        {sdp: message.sdp, type: message.type},
                    );

                    if (this.videoElement) {
                        this.videoElement.nativeElement.srcObject = this.videoStream;
                    }

                    this.socket.emit('answer', {
                        room: this.roomId,
                        sdp: answer.sdp,
                        sender: UserService.user,
                        sid: this.socket.id,
                        type: answer.type,
                    });
                }
            },
        );

        this.socket.on(
            'offerIceCandidateResponse',
            async (message: IIceCandidateMessage) => {
                await this.webrtcService.addIceCandidate(message);
            },
        );

        this.socket.on('disconnectCallResponse', () => {
            this.videoStream = new MediaStream();
            this.webrtcService.createPeerConnection();
            this.isPlaying = false;
            if (this.videoElement !== null) {
                this.videoElement.nativeElement.srcObject = null;
            }
        });
    }
}
