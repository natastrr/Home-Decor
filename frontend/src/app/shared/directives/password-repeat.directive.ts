import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[passwordRepeat]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordRepeatDirective, multi: true}],
})
export class PasswordRepeatDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password: AbstractControl | null = control.get('password');
    const passwordRepeat: AbstractControl | null = control.get('passwordRepeat');

    if (password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({passwordRepeat: true});
      return {passwordRepeat: true};
    }

    return null;
  }
}
