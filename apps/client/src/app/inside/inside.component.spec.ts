import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideComponent } from './inside.component';

describe('InsideComponent', () => {
    let component: InsideComponent;
    let fixture: ComponentFixture<InsideComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InsideComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InsideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect.assertions(1);
        expect(component).toBeTruthy();
    });
});