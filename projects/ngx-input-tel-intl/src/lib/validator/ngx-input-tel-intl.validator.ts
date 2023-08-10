import * as lpn from 'google-libphonenumber';
import { ChangeData } from '../model/change-data';
import { PhoneNumber, PhoneNumberUtil } from 'google-libphonenumber';

export const phoneNumberValidator = (control: any) => {
  if (!control.value) return;
  const el: HTMLElement = control.nativeElement as HTMLElement;
  const inputBox: HTMLInputElement | any = el?.querySelector('input[type="tel"]') || undefined;
  const phoneUtil: PhoneNumberUtil = lpn.PhoneNumberUtil.getInstance();
  if (inputBox) {
    const isCheckValidation = inputBox.getAttribute('validation');

    if (isCheckValidation === 'true') {
      const error = { invalidFormat: true };
      const phoneFormatted = new ChangeData(!control.value ? new PhoneNumber() : phoneUtil.parse(control.value));
      const number = phoneUtil.parse(phoneFormatted.number, phoneFormatted.countryCode);
      if (!phoneUtil.isValidNumberForRegion(number, phoneFormatted.countryCode)) return error;
    } else if (isCheckValidation === 'false') {
      control.clearValidators();
    }

  }
  return;
};
