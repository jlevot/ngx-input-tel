import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgxInputTelIntlModule } from '../../projects/ngx-input-tel-intl/src/lib/ngx-input-tel-intl.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		NgxInputTelIntlModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
