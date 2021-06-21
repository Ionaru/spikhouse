import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebrtcService {
    protected peerConnection!: RTCPeerConnection;
    protected iceCandidates: RTCIceCandidateInit[] = [];
    protected callId?: string;

    public constructor() {
        this.createPeerConnection();
    }

    public createPeerConnection(): void {
        const config: RTCConfiguration = {
            iceCandidatePoolSize: 10,
            iceServers: [
                {
                    urls: [
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                    ],
                },
            ],
        };
        this.peerConnection = new RTCPeerConnection(config);
    }

    public setStream(stream: MediaStream): void {
        stream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track);
        });
    }

    public async createOffer(): Promise<RTCSessionDescriptionInit> {
        const sessionDescription = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(sessionDescription);

        return sessionDescription;
    }

    public async createAnswer(
        stream: MediaStream,
        offer: RTCSessionDescriptionInit,
    ): Promise<RTCSessionDescriptionInit> {
        this.peerConnection.ontrack = (e) => {
            if (e.streams.length > 0) {
                e.streams[0].getTracks().forEach((track) => {
                    stream.addTrack(track);
                });
            } else {
                stream.addTrack(e.track);
            }
        };

        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer),
        );

        const sessionDescription = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(sessionDescription);

        return sessionDescription;
    }

    public async setRemoteDescriptionFromAnswer(
        answer: RTCSessionDescriptionInit,
    ): Promise<void> {
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer),
        );
    }

    public setOnIceCandidate(
        callback: (e: RTCPeerConnectionIceEvent) => void,
    ): void {
        this.peerConnection.onicecandidate = callback;
    }

    public async addIceCandidate(
        candidate: RTCIceCandidateInit,
    ): Promise<void> {
        await this.peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate),
        );
    }
}
