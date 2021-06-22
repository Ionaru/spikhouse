import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RoomsComponent } from './rooms.component';
import { RoomsService } from './rooms.service';

describe('RoomsComponent', () => {
    let component: RoomsComponent;
    let fixture: ComponentFixture<RoomsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RoomsComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [RoomsService],
        }).compileComponents();

        fixture = TestBed.createComponent(RoomsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });
});
