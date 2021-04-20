import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IMessage } from '@spikhouse/api-interfaces';

@Component({
    selector: 'spikhouse-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent {
    public hello$ = this.http.get<IMessage>('/api/hello');

    public constructor(private http: HttpClient) {}
}
