import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductService } from './product.service';
import { EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable() // this exposes the observable

  products$ = combineLatest([ // Combine subject and observable
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ]).pipe(
      map(([products, selectedCategoryId]) => // this is a variable for the productService and categorySelectedAction$
        products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )),
      catchError(err => {
        this.errorMessage = err
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        console.log('EMPTY', EMPTY);
        return EMPTY
      })
    );


  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId); // emit value to the action stream when an action occurs
  }


}
