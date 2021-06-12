import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppReadyEventService } from './app-ready-event.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserService } from './auth/user.service';
import { AppReadyGuard } from './guards/app-ready.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RoomComponent } from './rooms/room/room.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsService } from './rooms/rooms.service';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, HomeComponent, NavbarComponent, RegisterComponent, RoomsComponent, RoomComponent],
    imports: [BrowserModule, HttpClientModule, NgbModule, AppRoutingModule, FontAwesomeModule, ReactiveFormsModule, FormsModule],
    providers: [UserService, RoomsService, AuthGuard, AppReadyGuard, AppReadyEventService],
})
export class AppModule {}
