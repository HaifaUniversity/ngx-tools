import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates israeli ids.
 */
export function idValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value &&
      control.value.length === 9 &&
      !isNaN(control.value) &&
      +control.value % 1 === 0
    ) {
      let counter = 0;

      for (let i = 0; i < 9; i++) {
        const digit = +control.value.charAt(i);
        const weight = (i % 2) + 1;
        const weightedDigit = digit * weight;

        counter += weightedDigit > 9 ? weightedDigit - 9 : weightedDigit;
      }

      // If the sum of the weighted digits is divisible by 10 the id is valid.
      if (counter % 10 === 0) {
        return null;
      }
    }

    // Otherwise the id is invalid.
    return { id: true };
  };
}
