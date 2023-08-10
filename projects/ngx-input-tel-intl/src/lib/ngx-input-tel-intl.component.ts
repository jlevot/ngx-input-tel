import * as lpn from 'google-libphonenumber';
import { PhoneNumber, PhoneNumberUtil } from 'google-libphonenumber';

import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CountryCode } from './data/country-code';
import { CountryISO } from './model/country-iso.enum';
import { SearchCountryField } from './model/search-country-field.enum';
import { ChangeData } from './model/change-data';
import { Country } from './model/country.model';
import { phoneNumberValidator } from './validator/ngx-input-tel-intl.validator';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PhoneNumberFormat } from './model/phone-number-format.enum';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-tel-input-intl',
  templateUrl: './ngx-input-tel-intl.component.html',
  styleUrls: [ 'ngx-input-tel-intl.component.css', './flags/css/inputTel.css' ],
  providers: [
    CountryCode,
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => NgxInputTelIntlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: phoneNumberValidator,
      multi: true,
    },
  ],
})
export class NgxInputTelIntlComponent implements OnChanges {
  @ViewChild('countryList') countryList: ElementRef;

  @Input() favoriteCountries: string[] = [];
  @Input() enablePlaceholder = true;
  @Input() customPlaceholder: string;
  @Input() numberFormat: PhoneNumberFormat = PhoneNumberFormat.International;
  @Input() cssClass = 'form-control';
  // User option to display only some countries
  @Input() onlyCountries: string [] = [];
  @Input() enableAutoCountrySelect = true;
  @Input() searchCountryFlag = false;
  @Input() searchCountryField: SearchCountryField[] = [ SearchCountryField.All ];
  @Input() searchCountryPlaceholder = 'Search Country';
  @Input() maxLength: number;
  // User option to select by default the first item of the list, default true
  @Input() selectFirstCountry = true;
  @Input() selectedCountryISO: CountryISO;
  @Input() phoneValidation = true;
  @Input() inputId = 'phone';
  @Input() separateDialCode = false;
  @Input() lang = 'fr';

  @Output() readonly countryChange = new EventEmitter<Country>();

  public phoneUtil: PhoneNumberUtil = lpn.PhoneNumberUtil.getInstance();

  public selectedCountry: WritableSignal<Country> = signal<Country>(new Country());
  public countries: Country[] = [];
  public countries$: Observable<Country[]>;
  public searchQuery$ = new BehaviorSubject<string>('');
  public phoneNumber$ = new BehaviorSubject<PhoneNumber>(new PhoneNumber);
  public phoneNumberControl = new FormControl('');

  onTouched = () => {
  };
  propagateChange = (_: string) => {
  };

  constructor(private countryCodeData: CountryCode) {
    // If this is not set, ngx-bootstrap will try to use the bs3 CSS (which is not what we've embedded) and will
    // Add the wrong classes and such
    setTheme('bs4');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isSelectedCountryChanged(changes['selectedCountryISO'])) this.updateSelectedCountry()
    if (changes['favoriteCountries']) this.fetchCountryData()
  }

  /*
    This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
    Ref: http://codelyzer.com/rules/no-life-cycle-call/
  */
  init() {
    this.fetchCountryData();
    if (this.onlyCountries.length) this.countries = this.countries.filter((c) => this.onlyCountries.includes(c.iso2))
    if (this.selectFirstCountry) {
      const country = this.favoriteCountries.length ? this.favorites[0] : this.countries[0];
      this.setSelectedCountry(country);
    }
    this.updateSelectedCountry();
    this.phoneNumberControl.valueChanges.subscribe(value => {
      this.onPhoneNumberChange(value);
    })
    this.phoneNumber$.subscribe((phoneNumber: PhoneNumber) => {
      this.propagateChange(this.phoneUtil.format(phoneNumber, lpn.PhoneNumberFormat[this.numberFormat]));
    });
  }

  setSelectedCountry(country?: Country) {
    if (!country) return;
    this.selectedCountry.set(country);
    this.countryChange.emit(country);
  }

  public onPhoneNumberChange(value?: any): void {
    if (value?.length > 1) {
      const currentCountryCode = this.selectedCountry().iso2;
      const number = this.getParsedNumber(value, currentCountryCode);

      // Auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
      if (this.enableAutoCountrySelect) {
        const countryCode = this.getCountryIsoCode(number, number?.getCountryCode()) || currentCountryCode;
        if (countryCode && countryCode !== this.selectedCountry().iso2) {
          const newCountry = this.countries
            .sort((a, b) => a.priority - b.priority)
            .find((c) => c.iso2 === countryCode);
          if (newCountry) this.setSelectedCountry(newCountry);
        }
      }

      this.phoneNumber$.next(number);
    }
  }

  public onCountrySelect(country: Country, el: { focus: () => void; }): void {
    let number: PhoneNumber = new PhoneNumber();
    this.setSelectedCountry(country);

    const currentValue = this.phoneNumberControl.value;
    if (currentValue) number = this.getParsedNumber(currentValue, this.selectedCountry().iso2)

    this.phoneNumber$.next(number)

    el.focus();
  }

  public onSearchUpdated(searchQuery: string) {
    this.searchQuery$.next(searchQuery);
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\(\)\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.phoneNumberControl.disable();
  }

  writeValue(obj: string): void {
    this.init();
    const phoneNumber = this.initChangeData(obj);
    this.setSelectedCountry(this.countries.find(c => c.iso2.toUpperCase() === phoneNumber.countryCode));
    this.phoneNumberControl.setValue(phoneNumber.number || '')
  }

  /* --------------------------------- Helpers -------------------------------- */
  /**
   * Returns parse PhoneNumber object.
   * @param phoneNumber string
   * @param countryCode string
   */
  private getParsedNumber(phoneNumber: string = '', countryCode: string = ''): PhoneNumber {
    if (!phoneNumber || !countryCode) return new PhoneNumber();
    return this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
  }

  /**
   * Cleans dialcode from phone number string.
   * @param phoneNumber string
   */
  private removeDialCode(phoneNumber: string): string {
    return this.initChangeData(phoneNumber).number || '';
  }

  /**
   * Sifts through all countries and returns iso code of the primary country
   * based on the number provided.
   * @param countryCode country code in number format
   * @param number PhoneNumber object
   */
  private getCountryIsoCode(number: PhoneNumber, countryCode?: number): string | undefined {
    if (!countryCode) return;
    // Will use this to match area code from the first numbers
    // @ts-ignore
    const rawNumber = number['values_']['2'].toString();
    // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
    const countries = this.countries.filter(
      (c) => c.dialCode === countryCode.toString()
    );
    // Main country is the country, which has no areaCodes specified in country-code.ts file.
    const mainCountry = countries.find((c) => c.areaCodes === undefined);
    // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
    const secondaryCountries = countries.filter(
      (c) => c.areaCodes !== undefined
    );
    let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

    /*
      Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
      If no matches found, fallback to the main country.
    */
    secondaryCountries.forEach((country) => {
      // @ts-ignore
      country.areaCodes.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.iso2;
        }
      });
    });

    return matchedCountry;
  }

  /**
   * Gets formatted example phone number from phoneUtil.
   * @param countryCode string
   */
  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(this.phoneUtil.getExampleNumber(countryCode), lpn.PhoneNumberFormat[this.numberFormat]);
    } catch (e) {
      // @ts-ignore
      return e;
    }
  }

  protected fetchCountryData(): void {
    const regionsNames = new Intl.DisplayNames([ this.lang ], {
      type: 'region',
    });
    this.countries = this.countryCodeData.allCountries.map(country => ({
      name: regionsNames.of(country[1].toString()?.toUpperCase()) || '',
      iso2: country[1].toString(),
      dialCode: country[2].toString(),
      priority: +country[3] || 0,
      areaCodes: (country[4] as string[]) || undefined,
      htmlId: `item-${ country[1].toString() }`,
      flagClass: `iti__flag iti__${ country[1].toString().toLocaleLowerCase() }`,
      placeHolder: this.getPlaceholder(country[1].toString().toUpperCase()),
      isFavorite: this.favoriteCountries.includes(country[1].toString())
    }));

    this.countries$ = this.searchQuery$.asObservable().pipe(
      map(searchQuery => this.countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.isFavorite))
    );
  }

  /**
   * Updates selectedCountry.
   */
  private updateSelectedCountry() {
    if (!this.selectedCountryISO) return;
    const countrySelected = this.countries.find((c) => c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase())
    this.setSelectedCountry(countrySelected);
  }

  private isSelectedCountryChanged(selectedISO: SimpleChange): boolean {
    return this.countries && selectedISO && selectedISO.currentValue !== selectedISO.previousValue;
  }

  private get favorites(): Country[] {
    return this.countries.filter(c => c.isFavorite);
  }

  private getPlaceholder(countryCode: string): string {
    if (!this.enablePlaceholder) return '';
    if (this.customPlaceholder) return this.customPlaceholder;
    const placeholder = this.getPhoneNumberPlaceHolder(countryCode);
    if (this.separateDialCode) return this.removeDialCode(placeholder);
    return placeholder
  }

  private initChangeData(phoneNumber: string = ''): ChangeData {
    return new ChangeData(!phoneNumber ? new PhoneNumber() : this.phoneUtil.parse(phoneNumber));
  }
}
