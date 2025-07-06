import {Component, Input, OnInit} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() categoryWithTypes: CategoryWithTypeType | null = null;
  @Input() type: string | null = null;
  open: boolean = false;
  activeParams: ActiveParamsType = {types: []};
  from: number | null = null;
  to: number | null = null;

  get title(): string {
    if (this.categoryWithTypes) return this.categoryWithTypes.name;
    switch (this.type) {
      case 'height':
        return 'Высота';
      case 'diameter':
        return 'Диаметр';
      default:
        return '';
    }
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.activeParams = ActiveParamsUtil.processParams(params);
      if (this.type) {
        switch (this.type) {
          case 'height':
            this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo);
            this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
            this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
            break;
          case 'diameter':
            this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo);
            this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
            this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      } else {
        if (params['types']) {
          this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
        }
        if (this.categoryWithTypes && this.categoryWithTypes.types && this.categoryWithTypes.types.length > 0
          && this.categoryWithTypes.types.some((type: {id: string, name: string, url: string}) =>
            this.activeParams.types?.some((item: string) => type.url === item))) {
          this.open = true;
        }
      }
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, checked: boolean): void {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams: string | undefined = this.activeParams.types.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.types = [...this.activeParams.types, url];
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
  }

  updateFilterParamFromTo(param: string, value: string): void {
    if (param === 'heightFrom' || param === 'heightTo' || param === 'diameterFrom' || param === 'diameterTo') {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }
      this.activeParams.page = 1;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams}).then();
    }
  }
}
