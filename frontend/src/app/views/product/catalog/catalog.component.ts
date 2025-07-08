import {Component, HostListener, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {catchError, debounceTime, finalize, throwError} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {CartProductType, CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen: boolean = false;
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ];
  pages: number[] = [];
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;
  selectedSortText: string = 'Сортировать';

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .pipe(
        catchError((error) => {
          this.processCatalog();
          return throwError(() => error);
        }),
      )
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) throw new Error((data as DefaultResponseType).message);
        this.cart = data as CartType;
        if (this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .pipe(finalize(() => this.processCatalog()))
            .subscribe({
              next: (data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error: string = (data as DefaultResponseType).message;
                  throw new Error(error);
                }
                this.favoriteProducts = data as FavoriteType[];
              },
              error: (error: HttpErrorResponse) => console.log(error),
            });
        } else {
          this.processCatalog();
        }
      });
  }

  processCatalog() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((data: CategoryWithTypeType[]) => {
        this.categoriesWithTypes = data;
        this.activatedRoute.queryParams
          .pipe(debounceTime(800))
          .subscribe((params: Params) => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            if (this.activeParams.sort) {
              const selectedOption: {name: string, value: string} | undefined = this.sortingOptions.find((option: {name: string, value: string}) => option.value === this.activeParams.sort);
              this.selectedSortText = selectedOption ? selectedOption.name : 'Сортировать';
            } else {
              this.selectedSortText = 'Сортировать';
            }
            this.appliedFilters = [];
            this.activeParams.types.forEach((url: string) => {
              for (let i: number = 0; i < this.categoriesWithTypes.length; i++) {
                const foundType: { id: string, name: string, url: string } | undefined =
                  this.categoriesWithTypes[i].types.find((type: {
                    id: string,
                    name: string,
                    url: string
                  }) => type.url === url);
                if (foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParam: foundType.url,
                  });
                }
              }
            });
            if (this.activeParams.heightFrom) {
              this.appliedFilters.push({
                name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
                urlParam: 'heightFrom',
              });
            }
            if (this.activeParams.heightTo) {
              this.appliedFilters.push({
                name: 'Высота: до ' + this.activeParams.heightTo + ' см',
                urlParam: 'heightTo',
              });
            }
            if (this.activeParams.diameterFrom) {
              this.appliedFilters.push({
                name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
                urlParam: 'diameterFrom',
              });
            }
            if (this.activeParams.diameterTo) {
              this.appliedFilters.push({
                name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
                urlParam: 'diameterTo',
              });
            }

            this.productService.getProducts(this.activeParams)
              .subscribe((data: { totalCount: number, pages: number, items: ProductType[] }) => {
                this.pages = [];
                for (let i: number = 1; i <= data.pages; i++) this.pages.push(i);
                if (this.cart && this.cart.items.length > 0) {
                  this.products = data.items.map((product: ProductType) => {
                    if (this.cart) {
                      const productInCart: {
                        product: CartProductType,
                        quantity: number
                      } | undefined = this.cart.items.find((item: {
                        product: CartProductType,
                        quantity: number
                      }) => item.product.id === product.id);
                      if (productInCart) product.countInCart = productInCart?.quantity;
                    }
                    return product;
                  });
                } else {
                  this.products = data.items;
                }
                if (this.favoriteProducts) {
                  this.products = this.products.map((product: ProductType) => {
                    const productInFavorite: FavoriteType | undefined = this.favoriteProducts?.find((item: FavoriteType) => item.id === product.id);
                    if (productInFavorite) product.isInFave = true;
                    return product;
                  });
                }
              });
          });
      });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType): void {
    if (appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo' || appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter((item: string) => item !== appliedFilter.urlParam);
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string): void {
    this.activeParams.sort = value;
    const selectedOption: {name: string, value: string} | undefined = this.sortingOptions.find((option: {name: string, value: string}) => option.value === value);
    if (selectedOption) this.selectedSortText = selectedOption.name;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
    } else {
      this.activeParams.page = 2;
    }
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.sortingOpen && !(event.target as HTMLElement).closest('.catalog-sorting')) {
      this.sortingOpen = false;
    }
  }

}
