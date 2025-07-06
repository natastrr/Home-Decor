import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {CartType} from "../../../../types/cart.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;
  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;
  isLoggedIn: boolean = false;

  constructor(private cartService: CartService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) this.count = this.countInCart;
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = this.count;
      });
  }

  updateCount(value: number): void {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = 0;
        this.count = 1;
      });
  }

  navigate() {
    if (this.isLight) {
      this.router.navigate(['/product/' + this.product.url]).then();
    }
  }
}
