import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CountryISO } from '../../projects/ngx-input-tel-intl/src/lib/model/country-iso.enum';
import { PhoneNumberFormat } from 'google-libphonenumber';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ],
})
export class AppComponent {
    public readonly CountryISO = CountryISO;
    public readonly PhoneNumberFormat = PhoneNumberFormat;

    public separateDialCode: boolean = true;
    public favoriteCountries: CountryISO[] = [ CountryISO.FrenchPolynesia ];
    public phone = new FormControl({ value: '', disabled: false }, [ Validators.required ]);

    public changePreferredCountries(): void {
        this.favoriteCountries = [ CountryISO.India, CountryISO.Canada ];
    }
}
