import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgxInputTelIntlModule } from '../../projects/ngx-input-tel-intl/src/lib/ngx-input-tel-intl.module';
import { NgxInputTelIntlComponent } from "../../projects/ngx-input-tel-intl/src/lib/ngx-input-tel-intl.component";

@NgModule({
    declarations: [ AppComponent ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgxInputTelIntlModule,
        BrowserAnimationsModule
    ],
    exports: [ NgxInputTelIntlComponent ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
