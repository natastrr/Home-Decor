import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/payment.type";
import {DeliveryType} from "../../../../types/delivery.type";
import {UserService} from "../../../shared/services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes: typeof DeliveryType = DeliveryType;
  paymentTypes: typeof PaymentType = PaymentType;

  userInfoForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
  });

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
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
        };
        this.userInfoForm.setValue(paramsToUpdate);
        if (userInfo.deliveryType) this.deliveryType = userInfo.deliveryType;
      });
  }

  changeDeliveryType(deliveryType: DeliveryType): void {
    this.deliveryType = deliveryType;
    this.userInfoForm.markAsDirty();
  }

  updateUserInfo() {
    if (this.userInfoForm.valid) {
      const paramObject: UserInfoType = {
        email: this.userInfoForm.value.email,
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.value.paymentType,
      };

      if (this.userInfoForm.value.firstName) paramObject.firstName = this.userInfoForm.value.firstName;
      if (this.userInfoForm.value.lastName) paramObject.lastName = this.userInfoForm.value.lastName;
      if (this.userInfoForm.value.fatherName) paramObject.fatherName = this.userInfoForm.value.fatherName;
      if (this.userInfoForm.value.phone) paramObject.phone = this.userInfoForm.value.phone;
      if (this.userInfoForm.value.street) paramObject.street = this.userInfoForm.value.street;
      if (this.userInfoForm.value.house) paramObject.house = this.userInfoForm.value.house.toString();
      if (this.userInfoForm.value.entrance) paramObject.entrance = this.userInfoForm.value.entrance.toString();
      if (this.userInfoForm.value.apartment) paramObject.apartment = this.userInfoForm.value.apartment.toString();

      this.userService.updateUserInfo(paramObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }
            this._snackBar.open('Данные успешно сохранены!');
            this.userInfoForm.markAsPristine();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка сохранения данных!');
            }
          },
        });
    }
  }

  get email() {
    return this.userInfoForm.get('email');
  }
}
