import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../model/Category';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface ProductFilter {
  search: string;
  categoryId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div class="filter-container">
      <form [formGroup]="filterForm" class="filter-form">
        <!-- Search -->
        <mat-form-field appearance="outline">
          <mat-label>{{ 'products.filter.search' | translate }}</mat-label>
          <input matInput formControlName="search" type="text">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <!-- Category -->
        <mat-form-field appearance="outline">
          <mat-label>{{ 'products.filter.category' | translate }}</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option [value]="null">{{ 'products.filter.allCategories' | translate }}</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Price range -->
        <div class="price-range">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'products.filter.minPrice' | translate }}</mat-label>
            <input matInput formControlName="minPrice" type="number" min="0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'products.filter.maxPrice' | translate }}</mat-label>
            <input matInput formControlName="maxPrice" type="number" min="0">
          </mat-form-field>
        </div>

        <!-- Reset button -->
        <button mat-stroked-button 
                color="primary" 
                type="button"
                (click)="resetFilters()"
                [disabled]="!isFiltering">
          <mat-icon>clear</mat-icon>
          {{ 'products.filter.reset' | translate }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;

      mat-form-field {
        flex: 1 1 200px;
      }

      .price-range {
        display: flex;
        gap: 16px;
        flex: 2 1 400px;

        mat-form-field {
          flex: 1;
        }
      }

      button {
        margin-top: 4px;
        height: 53px;
      }
    }
  `]
})
export class ProductFilterComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() filterChange = new EventEmitter<ProductFilter>();

  filterForm: FormGroup;
  
  get isFiltering(): boolean {
    const values = this.filterForm.value;
    return values.search || 
           values.categoryId || 
           values.minPrice || 
           values.maxPrice;
  }

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      categoryId: [null],
      minPrice: [null],
      maxPrice: [null]
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.filterChange.emit(filters);
      });
  }

  resetFilters() {
    this.filterForm.reset({
      search: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null
    });
  }
}