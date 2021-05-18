import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserService } from './auth/user.service';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, HomeComponent, NavbarComponent, RegisterComponent],
    imports: [BrowserModule, HttpClientModule, NgbModule, AppRoutingModule, FontAwesomeModule, ReactiveFormsModule],
    providers: [UserService],
})
export class AppModule {}
