import {Directive, HostListener, Input} from '@angular/core';
import {FavoriteService} from "../services/favorite.service";
import {AuthService} from "../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProductType} from "../../../types/product.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {FavoriteType} from "../../../types/favorite.type";

@Directive({
  selector: '[updateFavorite]'
})
export class UpdateFavoriteDirective {

  @Input() product!: ProductType;

  constructor(private favoriteService: FavoriteService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {}

  @HostListener('click') onClick() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться!');
      return;
    }
    if (this.product.isInFave) {
      this.favoriteService.removeFavorite(this.product.id).subscribe((data: DefaultResponseType) => {
        if (data.error) throw new Error(data.message);
        this.product.isInFave = false;
      });
    } else {
      this.favoriteService.addFavorite(this.product.id).subscribe((data: FavoriteType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) throw new Error((data as DefaultResponseType).message);
        this.product.isInFave = true;
      });
    }
  }
}
