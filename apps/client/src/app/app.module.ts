import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, HomeComponent, NavbarComponent],
    imports: [BrowserModule, HttpClientModule, NgbModule, AppRoutingModule, FontAwesomeModule],
    providers: [],
})
export class AppModule {}
