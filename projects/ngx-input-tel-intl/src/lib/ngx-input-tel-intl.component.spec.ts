import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxInputTelIntlComponent } from './ngx-input-tel-intl.component';
import { FilterPipe } from "./pipe/filter.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe('NgxIntlTelInputComponent', () => {
    let component: NgxInputTelIntlComponent;
    let fixture: ComponentFixture<NgxInputTelIntlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NgxInputTelIntlComponent, FilterPipe ],
            imports: [ FormsModule, ReactiveFormsModule ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxInputTelIntlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
