import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  isLoading = false;
  currentOffset = 0;
  hasMoreProducts = true;
  isLoadingMore = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    
    forkJoin({
      products: this.productService.getProducts(this.currentOffset),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (results) => {
        this.processProductResults(results.products);
        this.processCategoriesResults(results.categories);
        this.filterProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('products.errors.loadFailed');
        this.isLoading = false;
      }
    });
  }

  loadProducts(loadMore: boolean = false) {
    if (!loadMore) {
      this.resetProductsList();
    } else {
      this.isLoadingMore = true;
    }

    this.productService.getProducts(this.currentOffset).subscribe({
      next: (newProducts: Product[]) => {
        this.processProductResults(newProducts);
        this.filterProducts();
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (error: any) => {
        this.handleError('products.errors.loadFailed');
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  private resetProductsList() {
    this.isLoading = true;
    this.currentOffset = 0;
    this.products = [];
  }

  private processProductResults(products: Product[]) {
    if (products.length === 0) {
      this.hasMoreProducts = false;
    } else {
      this.products = [...this.products, ...products];
      this.currentOffset += products.length;
    }
  }

  private processCategoriesResults(categories: any[]) {
    if (categories && categories.length > 0) {
      this.categories = categories.map(category => category.name);
    }
  }

  loadMoreProducts() {
    if (!this.isLoadingMore && this.hasMoreProducts) {
      this.loadProducts(true);
    }
  }

  filterProducts() {
    let filtered = this.products;
    
    if (this.selectedCategory) {
      filtered = filtered.filter(
        product => product.category.name === this.selectedCategory
      );
    }
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        product => product.title.toLowerCase().includes(term)
      );
    }
    
    this.filteredProducts = filtered;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createProduct(result);
      }
    });
  }

  private createProduct(productData: any) {
    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.showSuccess('products.success.added');
        this.loadProducts();
      },
      error: () => {
        this.handleError('products.errors.addFailed');
      }
    });
  }

  openEditDialog(product: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: product,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && product.id) {
        this.updateProduct(product.id, result);
      }
    });
  }

  private updateProduct(id: number, productData: any) {
    this.productService.updateProduct(id, productData).subscribe({
      next: () => {
        this.showSuccess('products.success.updated');
        this.loadProducts();
      },
      error: () => {
        this.handleError('products.errors.updateFailed');
      }
    });
  }

  deleteProduct(id: number, event: MouseEvent) {
    event.stopPropagation();
    
    const product = this.products.find(p => p.id === id);
    const productName = product?.title || '';
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('products.confirmDelete'),
        message: this.translate.instant('products.confirmDelete'),
        productName: productName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDeleteProduct(id);
      }
    });
  }

  private performDeleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showSuccess('products.success.deleted');
        this.loadProducts();
      },
      error: () => {
        this.handleError('products.errors.deleteFailed');
      }
    });
  }

  private showSuccess(messageKey: string) {
    this.toastr.success(
      this.translate.instant(messageKey),
      this.translate.instant('products.success.title')
    );
  }

  private handleError(messageKey: string) {
    this.toastr.error(
      this.translate.instant(messageKey),
      this.translate.instant('products.errors.title')
    );
  }
}