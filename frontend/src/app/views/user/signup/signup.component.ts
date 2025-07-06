import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]],
    passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]],
    agree: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {}

  signup() {
    if (this.signupForm.valid && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            this.authService.authSuccess(data, 'Вы успешно зарегистировались!');
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.authService.authError(errorResponse, 'Ошибка регистрации!');
          },
        });
    }
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get passwordRepeat() {
    return this.signupForm.get('passwordRepeat');
  }

}
