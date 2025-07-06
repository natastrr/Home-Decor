import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartProductType, CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private count: number = 0;
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {}

  setCount(count: number): void {
    this.count = count;
    this.count$.next(this.count);
  }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }

  getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{
      count: number
    } | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap((data: { count: number } | DefaultResponseType) => {
          if (!data.hasOwnProperty('error')) this.setCount((data as { count: number }).count);
        })
      );
  }

  updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', {
      productId,
      quantity
    }, {withCredentials: true})
      .pipe(
        tap((data: CartType | DefaultResponseType) => {
          if (!data.hasOwnProperty('error')) {
            let count: number = 0;
            (data as CartType).items.forEach((item: { product: CartProductType, quantity: number }) => count += item.quantity);
            this.setCount(count);
          }
        })
      );
  }

}
