import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgxInputTelIntlModule } from "../../projects/ngx-input-tel-intl/src/lib/ngx-input-tel-intl.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            imports: [ NgxInputTelIntlModule, FormsModule, ReactiveFormsModule ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render title in a h1 tag', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Test International Telephone Input Form');
    });
});
