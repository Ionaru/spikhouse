import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { AppReadyEventService } from './app-ready-event.service';
import { AppComponent } from './app.component';
import { UserService } from './auth/user.service';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsService } from './rooms/rooms.service';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, HomeComponent, NavbarComponent, RoomsComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, FontAwesomeTestingModule],
            providers: [AppReadyEventService, UserService, RoomsService],
        }).compileComponents();
    }));

    it('should create the app', () => {
        expect.assertions(1);
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
