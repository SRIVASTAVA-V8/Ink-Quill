import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  registerForm: FormGroup;

  submitted = false;
  loading = false;

  errorMessage = '';
  successMessage = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*?&]).*$/
            )
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ],

        termsAccepted: [
          false,
          Validators.requiredTrue
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }


  get f() {
    return this.registerForm.controls;
  }


  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword =
      control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }


  hasUppercase(): boolean {
    return /[A-Z]/.test(
      this.f['password'].value || ''
    );
  }


  hasNumber(): boolean {
    return /\d/.test(
      this.f['password'].value || ''
    );
  }


  hasSpecialCharacter(): boolean {
    return /[!@$%*?&]/.test(
      this.f['password'].value || ''
    );
  }


  isFieldInvalid(fieldName: string): boolean {

    const field = this.registerForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.touched || this.submitted)
    );
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPassword(): void {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }


  onSubmit(): void {

    this.submitted = true;

    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const registerData = {
      name: this.f['name'].value.trim(),
      email: this.f['email'].value.trim(),
      password: this.f['password'].value
    };

    this.authService.register(registerData).subscribe({
      next: () => {

        this.loading = false;
        this.router.navigate(['/']);
      },
      error: error => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          'Unable to create your account. Please try again.';
      }
    });
  }
}