import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusCodes } from 'http-status-codes';

import { RoomsService } from '../rooms.service';

import { CreateRoomComponent } from './create-room.component';

describe('CreateRoomComponent', () => {
    let component: CreateRoomComponent;
    let fixture: ComponentFixture<CreateRoomComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateRoomComponent],
            imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [RoomsService],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });

    it('should handle the error correctly when 404', () => {
        expect.assertions(2);
        expect(component.createError).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.CONFLICT});
        component.handleError(error);
        expect(component.createError).toStrictEqual('You can not re-use your account password.');
    });

    it('should handle the error correctly when another error', () => {
        expect.assertions(2);
        expect(component.createError).toStrictEqual('');
        const error = new HttpErrorResponse({status: StatusCodes.INTERNAL_SERVER_ERROR});
        component.handleError(error);
        expect(component.createError).toStrictEqual('Unknown error, please try again later.');
    });
});
