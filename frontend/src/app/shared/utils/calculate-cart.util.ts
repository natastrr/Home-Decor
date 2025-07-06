import {CartProductType, CartType} from "../../../types/cart.type";

export class CalculateCart {

  static calculateCartTotal(cart: CartType | null): [number, number] {
    let totalAmount: number = 0;
    let totalCount: number = 0;
    if (cart) {
      cart.items.forEach((item: { product: CartProductType, quantity: number }) => {
        totalAmount += item.quantity * item.product.price;
        totalCount += item.quantity;
      });
    }
    return [totalAmount, totalCount];
  }

}
