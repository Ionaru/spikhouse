import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { RoomsService } from '../rooms.service';

import { RoomComponent } from './room.component';

describe('RoomComponent', () => {
    let component: RoomComponent;
    let fixture: ComponentFixture<RoomComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoomComponent],
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [RoomsService],
        }).compileComponents();

        fixture = TestBed.createComponent(RoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });
});
