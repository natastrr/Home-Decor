import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';

  isLoggedIn$: Subject<boolean> = new Subject<boolean>();
  private isLoggedIn: boolean = false;

  constructor(private http: HttpClient,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLoggedIn = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    });
  }

  signup(email: string, password: string, passwordRepeat: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {
      email,
      password,
      passwordRepeat
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: tokens.refreshToken});
    }
    throw throwError(() => 'Can not find token.');
  }

  refresh(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'refresh', {refreshToken: tokens.refreshToken});
    }
    throw throwError(() => 'Can not use token.');
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedIn = true;
    this.isLoggedIn$.next(true);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn = false;
    this.isLoggedIn$.next(false);
  }

  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  authSuccess(data: LoginResponseType | DefaultResponseType, message: string) {
    let error = null;
    if ((data as DefaultResponseType).error !== undefined) {
      error = (data as DefaultResponseType).message;
    }
    const loginResponse: LoginResponseType = data as LoginResponseType;
    if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
      error = 'Ошибка авторизации!';
    }
    if (error) {
      this._snackBar.open(error);
      throw new Error(error);
    }
    this.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
    this.userId = loginResponse.userId;
    this._snackBar.open(message);
    this.router.navigate(['/']).then();
  }

  authError(errorResponse: HttpErrorResponse, errorMessage: string) {
    if (errorResponse.error && errorResponse.error.message) {
      this._snackBar.open(errorResponse.error.message);
    } else {
      this._snackBar.open(errorMessage);
    }
  }

}
