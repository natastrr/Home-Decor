import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import {ProductCardComponent} from './components/product-card/product-card.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CategoryFilterComponent} from './components/category-filter/category-filter.component';
import {CountSelectorComponent} from './components/count-selector/count-selector.component';
import {UpdateFavoriteDirective} from './directives/update-favorite.directive';
import {LoaderComponent} from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CategoryFilterComponent,
    CountSelectorComponent,
    UpdateFavoriteDirective,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  exports: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CategoryFilterComponent,
    CountSelectorComponent,
    UpdateFavoriteDirective,
    LoaderComponent,
  ]
})
export class SharedModule {
}
