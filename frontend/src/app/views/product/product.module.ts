import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductRoutingModule} from './product-routing.module';
import {CatalogComponent} from './catalog/catalog.component';
import {DetailComponent} from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";

@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule,
    ProductRoutingModule,
  ]
})
export class ProductModule {

}
