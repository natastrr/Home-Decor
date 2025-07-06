import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {catchError, concatMap, debounceTime, finalize, throwError} from "rxjs";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  products: ProductType[] = [];
  @Input() categories: CategoryWithTypeType[] = [];
  isLoggedIn: boolean = false;
  count: number = 0;
  serverStaticPath: string = environment.serverStaticPath;
  showedSearch: boolean = false;
  searchField: FormControl<string> = new FormControl();

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private cartService: CartService,
              private productService: ProductService,
              private router: Router) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(debounceTime(800))
      .subscribe((value: string) => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value).subscribe((data: ProductType[]) => {
            this.products = data;
            this.showedSearch = true;
          });
        } else {
          this.products = [];
        }
      });

    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;
      });
    this.cartService.count$
      .subscribe((count: number) => {
        this.count = count;
      });
  }

  logout(): void {
    this.authService.logout()
      .pipe(
        concatMap((logoutResponse: DefaultResponseType) => {
          if (logoutResponse.error) throw new Error(logoutResponse.message);
          this.authService.removeTokens();
          this.authService.userId = null;
          return this.cartService.getCartCount();
        }),
        catchError((error: HttpErrorResponse) => {
          this.authService.removeTokens();
          this.authService.userId = null;
          this.cartService.setCount(0);
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this._snackBar.open('Вы вышли из системы!');
        this.router.navigate(['/']).then();
      });
  }

  selectProduct(url: string): void {
    this.router.navigate(['/product/' + url]).then();
    this.searchField.setValue('');
    this.products = [];
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }
}
