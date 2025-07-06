import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CartType} from "../../../../types/cart.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CalculateCart} from "../../../shared/utils/calculate-cart.util";
import {DeliveryType} from "../../../../types/delivery.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../shared/services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  cart: CartType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  shippingCost: number = 10;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes: typeof DeliveryType = DeliveryType;
  paymentTypes: typeof PaymentType = PaymentType;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  orderForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  });

  constructor(private cartService: CartService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private orderService: OrderService,
              private userService: UserService,
              private authService: AuthService) {
    this.updateDeliveryTypeValidation();
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пустая!');
          this.router.navigate(['/']).then();
          return;
        }
        [this.totalAmount, this.totalCount] = CalculateCart.calculateCartTotal(this.cart);
      });

    if (this.authService.getIsLoggedIn()) {
      this.userService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          const userInfo: UserInfoType = data as UserInfoType;
          const paramsToUpdate: {
            firstName: string,
            lastName: string,
            fatherName: string,
            phone: string,
            paymentType: PaymentType,
            email: string,
            street: string,
            house: string,
            entrance: string,
            apartment: string,
            comment: '',
          } = {
            firstName: userInfo.firstName ? userInfo.firstName : '',
            lastName: userInfo.lastName ? userInfo.lastName : '',
            fatherName: userInfo.fatherName ? userInfo.fatherName : '',
            phone: userInfo.phone ? userInfo.phone : '',
            paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
            email: userInfo.email ? userInfo.email : '',
            street: userInfo.street ? userInfo.street : '',
            house: userInfo.house ? userInfo.house : '',
            entrance: userInfo.entrance ? userInfo.entrance : '',
            apartment: userInfo.apartment ? userInfo.apartment : '',
            comment: '',
          };
          this.orderForm.setValue(paramsToUpdate);
          if (userInfo.deliveryType) this.deliveryType = userInfo.deliveryType;
        });
    }
  }

  changeDeliveryType(type: DeliveryType): void {
    this.deliveryType = type;
    this.updateDeliveryTypeValidation();
  }

  updateDeliveryTypeValidation(): void {
    if (this.deliveryType == DeliveryType.delivery) {
      this.street?.setValidators(Validators.required);
      this.house?.setValidators(Validators.required);
    } else {
      this.street?.removeValidators(Validators.required);
      this.house?.removeValidators(Validators.required);
      this.street?.setValue('');
      this.house?.setValue('');
      this.entrance?.setValue('');
      this.apartment?.setValue('');
    }
    this.street?.updateValueAndValidity();
    this.house?.updateValueAndValidity();
  }

  createOrder(): void {
    if (this.orderForm.valid) {
      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email,
      };
      if (this.deliveryType == DeliveryType.delivery) {
        if (this.orderForm.value.street) paramsObject.street = this.orderForm.value.street;
        if (this.orderForm.value.house) paramsObject.house = this.orderForm.value.house.toString();
        if (this.orderForm.value.entrance) paramsObject.entrance = this.orderForm.value.entrance.toString();
        if (this.orderForm.value.apartment) paramsObject.apartment = this.orderForm.value.apartment.toString();
      }
      if (this.orderForm.value.comment) paramsObject.comment = this.orderForm.value.comment;
      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick().subscribe(() => this.router.navigate(['/']).then());
            this.cartService.setCount(0);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка в оформлении заказа!');
            }
          },
        });
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Для оформления заказа заполните форму!');
    }
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.router.navigate(['/']).then();
  }

  get lastName() {
    return this.orderForm.get('lastName');
  }

  get firstName() {
    return this.orderForm.get('firstName');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  get email() {
    return this.orderForm.get('email');
  }

  get street() {
    return this.orderForm.get('street');
  }

  get house() {
    return this.orderForm.get('house');
  }

  get entrance() {
    return this.orderForm.get('entrance');
  }

  get apartment() {
    return this.orderForm.get('apartment');
  }
}
