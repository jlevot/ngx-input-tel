import * as lpn from "google-libphonenumber";
import { PhoneNumber, PhoneNumberFormat, PhoneNumberUtil, RegionCode } from "google-libphonenumber";
import { LocalPhoneUtils } from "./local-phone-utils";
import { ChangeData } from "../model/change-data";
import { Country } from "../model/country.model";

describe('NgxIntlTelInputComponent', () => {
    const phoneNumberUtils: PhoneNumberUtil = lpn.PhoneNumberUtil.getInstance();
    const defaultPhoneNumber: string = '40404040';
    const defaultRegionCode: RegionCode = 'PF';

    it('should parse a number with a PhoneNumber format', () => {
        expect(LocalPhoneUtils.getParsedNumber()).toEqual(new PhoneNumber());
        expect(LocalPhoneUtils.getParsedNumber('null', defaultRegionCode)).toEqual(new PhoneNumber());
        const numberToCompare = phoneNumberUtils.parse(defaultPhoneNumber, defaultRegionCode)
        expect(numberToCompare).toEqual(LocalPhoneUtils.getParsedNumber(defaultPhoneNumber, defaultRegionCode));
    });

    it('should return a ChangeData object', () => {
        expect(LocalPhoneUtils.getChangeData()).toEqual(new ChangeData())
        const changeDataToCompare: ChangeData = {
            countryCode: 'PF',
            dialCode: '+689',
            e164Number: '+68940404040',
            internationalNumber: '+689 40 40 40 40',
            nationalNumber: '40 40 40 40',
            number: '40 40 40 40'
        }
        expect(LocalPhoneUtils.getChangeData('+68940404040')).toEqual(changeDataToCompare)
    });

    it('should return a placeholder sample by numberFormat give in params', () => {
        expect(LocalPhoneUtils.getPhoneNumberPlaceHolder(PhoneNumberFormat.INTERNATIONAL, defaultRegionCode)).toEqual('+689 40 41 23 45');
        expect(LocalPhoneUtils.getPhoneNumberPlaceHolder(PhoneNumberFormat.NATIONAL, defaultRegionCode)).toEqual('40 41 23 45');
        expect(LocalPhoneUtils.getPhoneNumberPlaceHolder(PhoneNumberFormat.E164, defaultRegionCode)).toEqual('+68940412345');
    });

    it('should return the country if the query is matching with searchField gave in params', () => {
        const country: Country = {
            areaCodes: undefined,
            dialCode: '689',
            flagClass: 'iti__flag iti__pf',
            htmlId: 'item-pf',
            isFavorite: true,
            iso2: 'pf',
            name: 'Polynésie française',
            placeHolder: '40 41 23 45',
            priority: 0
        }
        expect(LocalPhoneUtils.isCountryMatching(country, 'test', "ALL")).toBeFalsy();
        expect(LocalPhoneUtils.isCountryMatching(country, 'Pol', "ALL")).toBeTruthy();
        expect(LocalPhoneUtils.isCountryMatching(country, '68', "ALL")).toBeTruthy();
        expect(LocalPhoneUtils.isCountryMatching(country, 'pf', "ALL")).toBeTruthy();

        expect(LocalPhoneUtils.isCountryMatching(country, 'Pol', "NAME")).toBeTruthy();
        expect(LocalPhoneUtils.isCountryMatching(country, '68', "NAME")).toBeFalsy();
        expect(LocalPhoneUtils.isCountryMatching(country, 'pf', "NAME")).toBeFalsy();

        expect(LocalPhoneUtils.isCountryMatching(country, 'Pol', "DIALCODE")).toBeFalsy();
        expect(LocalPhoneUtils.isCountryMatching(country, '68', "DIALCODE")).toBeTruthy();
        expect(LocalPhoneUtils.isCountryMatching(country, 'pf', "DIALCODE")).toBeFalsy();

        expect(LocalPhoneUtils.isCountryMatching(country, 'Pol', "ISO2")).toBeFalsy();
        expect(LocalPhoneUtils.isCountryMatching(country, '68', "ISO2")).toBeFalsy();
        expect(LocalPhoneUtils.isCountryMatching(country, 'pf', "ISO2")).toBeTruthy();
    });

    it('should return the matched country compare too the regionCode and regionArea when is more than one', () => {
        const phoneNumberUtils: PhoneNumberUtil = lpn.PhoneNumberUtil.getInstance();
        let phoneNumber: PhoneNumber = phoneNumberUtils.parse('+68940404040');
        expect(LocalPhoneUtils.getCountryIsoCode(phoneNumber, phoneNumber?.getCountryCode())).toEqual('pf');
        phoneNumber = phoneNumberUtils.parse('+12044040404');
        expect(LocalPhoneUtils.getCountryIsoCode(phoneNumber, phoneNumber?.getCountryCode())).toEqual('ca');
        phoneNumber = phoneNumberUtils.parse('+15624040404');
        expect(LocalPhoneUtils.getCountryIsoCode(phoneNumber, phoneNumber?.getCountryCode())).toEqual('us');
    });
});
