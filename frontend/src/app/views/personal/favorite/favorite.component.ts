import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartProductType, CartType} from "../../../../types/cart.type";
import {concatMap} from "rxjs";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;
  cart: CartType | null = null;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .pipe(
        concatMap((data: FavoriteType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) throw new Error((data as DefaultResponseType).message);
          this.products = data as FavoriteType[];
          return this.cartService.getCart();
        }),
      )
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) throw new Error((data as DefaultResponseType).message);

        const cart: CartType = data as CartType;
        this.products = this.products.map((productItem: FavoriteType) => {
          const faveProductInCart: { product: CartProductType, quantity: number } | undefined =
            cart.items.find((cartItem: {
              product: CartProductType,
              quantity: number
            }) => cartItem.product.id === productItem.id);
          if (faveProductInCart) {
            productItem.inCart = true;
            productItem.count = faveProductInCart.quantity;
          }
          return productItem;
        });
      });
  }

  removeFromFavorites(id: string): void {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) throw new Error(data.message);
        this.products = this.products.filter((item: FavoriteType) => item.id !== id);
      });
  }

  addToCart(productId: string, count: number): void {
    this.cartService.updateCart(productId, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const product: FavoriteType | undefined = this.products.find((item: FavoriteType) => item.id === productId);
        if (product) {
          product.inCart = true;
          product.count = count;
        }
      });
  }

  removeFromCart(productId: string) {
    this.cartService.updateCart(productId, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const product: FavoriteType | undefined = this.products.find((item: FavoriteType) => item.id === productId);
        if (product) {
          product.inCart = false;
          product.count = 0;
        }
      });
  }

  updateCount(productId: string, count: number): void {
    this.cartService.updateCart(productId, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
      });
  }

}
