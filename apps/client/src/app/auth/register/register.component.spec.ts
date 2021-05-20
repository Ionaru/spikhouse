import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusCodes } from 'http-status-codes';

import { UserService } from '../user.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [HttpClientTestingModule, ReactiveFormsModule],
            providers: [UserService],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });

    it('should handle the error correctly when 404', () => {
        expect.assertions(2);
        expect(component.error).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.CONFLICT});
        component.handleError(error);
        expect(component.error).toStrictEqual('Email is already in use.');
    });

    it('should handle the error correctly when another error', () => {
        expect.assertions(2);
        expect(component.error).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.INTERNAL_SERVER_ERROR});
        component.handleError(error);
        expect(component.error).toStrictEqual('');
    });
});
