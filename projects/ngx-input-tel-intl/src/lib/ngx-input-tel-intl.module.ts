import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { NgxInputTelIntlComponent } from './ngx-input-tel-intl.component';
import { FilterPipe } from './pipe/filter.pipe';
import { DialCodePipe } from './pipe/dialCode.pipe';

export const dropdownModuleForRoot: ModuleWithProviders<BsDropdownModule> = BsDropdownModule.forRoot();

@NgModule({
  declarations: [ NgxInputTelIntlComponent, NativeElementInjectorDirective, FilterPipe, DialCodePipe ],
	imports: [
		CommonModule,
		FormsModule,
    ReactiveFormsModule,
    dropdownModuleForRoot
  ],
	exports: [NgxInputTelIntlComponent, NativeElementInjectorDirective],
})
export class NgxInputTelIntlModule {
}
