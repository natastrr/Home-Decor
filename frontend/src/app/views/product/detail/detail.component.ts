import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartProductType, CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  count: number = 1;
  product!: ProductType;
  recommendedProducts: ProductType[] = [];
  customOptionsRecommendedProducts: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false,
  }
  serverStaticPath: string = environment.serverStaticPath;
  isLoggedIn: boolean = false;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
          this.product = data;
          this.cartService.getCart().subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }
            const cartDataResponse: CartType = cartData as CartType;
            if (cartDataResponse) {
              const productInCart: { product: CartProductType, quantity: number } | undefined =
                cartDataResponse.items.find((item: { product: CartProductType, quantity: number }) =>
                  item.product.id === this.product.id);
              if (productInCart) {
                this.product.countInCart = productInCart.quantity;
                this.count = this.product.countInCart;
              }
            }
          });
          if (this.authService.getIsLoggedIn()) {
            this.isLoggedIn = true;
            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }
                const products: FavoriteType[] = data as FavoriteType[];
                const currentProductExists: FavoriteType | undefined = products.find((item: FavoriteType) => item.id === this.product.id);
                if (currentProductExists) this.product.isInFave = true;
              });
          }
        });
    });
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      });
  }

  updateCount(value: number): void {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.countInCart = this.count;
        });
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = this.count;
      });
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = 0;
        this.count = 1;
      });
  }

}
