import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";
import {CategoryWithTypeType} from "../../../types/category-with-type.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  categories: CategoryWithTypeType[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypeType[]) => {
        this.categories = categories.map((item: CategoryWithTypeType) => {
          return Object.assign(item, {
            typesUrls: item.types.map((item: {
              id: string,
              name: string,
              url: string
            }) => item.url)
          });
        });
      });
  }

}
