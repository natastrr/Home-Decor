import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {concatMap} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder,
              private cartService: CartService,
              private authService: AuthService) {
  }

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.rememberMe)
        .pipe(
          concatMap((data: LoginResponseType | DefaultResponseType) => {
            this.authService.authSuccess(data, 'Вы успешно авторизовались!');
            return this.cartService.getCartCount();
          })
        )
        .subscribe({
          next: (cartData: { count: number } | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error) {
              throw new Error((cartData as DefaultResponseType).message);
            }
            this.cartService.setCount((cartData as { count: number }).count);
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.authService.authError(errorResponse, 'Ошибка авторизации!');
          }
        });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
