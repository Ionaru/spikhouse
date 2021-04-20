import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IMessage } from '@spikhouse/api-interfaces';

@Component({
    selector: 'spikhouse-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {
    hello$ = this.http.get<IMessage>('/api/hello');

    constructor(private http: HttpClient) {}
}
