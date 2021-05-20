import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusCodes } from 'http-status-codes';

import { UserService } from '../auth/user.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
            providers: [UserService],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });

    it('should handle the error correctly when 404', () => {
        expect.assertions(2);
        expect(component.loginError).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.NOT_FOUND});
        component.handleError(error);
        expect(component.loginError).toStrictEqual('Unknown login.');
    });

    it('should handle the error correctly when another error', () => {
        expect.assertions(2);
        expect(component.loginError).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.INTERNAL_SERVER_ERROR});
        component.handleError(error);
        expect(component.loginError).toStrictEqual('');
    });
});
