import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField } from '../../projects/ngx-input-tel-intl/src/lib/model/search-country-field.enum';
import { CountryISO } from '../../projects/ngx-input-tel-intl/src/lib/model/country-iso.enum';
import { PhoneNumberFormat } from '../../projects/ngx-input-tel-intl/src/lib/model/phone-number-format.enum';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
  favoriteCountries: CountryISO[] = [ CountryISO.FrenchPolynesia ];

  phoneForm = new FormGroup({
    phone: new FormControl({ value: '+68940414141', disabled: false }, [ Validators.required ]),
	});

	changePreferredCountries() {
		this.favoriteCountries = [CountryISO.India, CountryISO.Canada];
	}
}
