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
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/Product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  isLoading = false;
  currentOffset = 0;
  hasMoreProducts = true;
  isLoadingMore = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(loadMore: boolean = false) {
    if (!loadMore) {
      this.isLoading = true;
      this.currentOffset = 0;
      this.products = [];
    } else {
      this.isLoadingMore = true;
    }

    this.productService.getProducts(this.currentOffset).subscribe({
      next: (newProducts) => {
        if (newProducts.length === 0) {
          this.hasMoreProducts = false;
        } else {
          this.products = [...this.products, ...newProducts];
          this.currentOffset += newProducts.length;
          
          // Update categories only on initial load
          if (!loadMore) {
            this.categories = [...new Set(this.products.map(product => product.category.name))];
          }
        }
        
        this.filterProducts();
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (error) => {
        this.toastr.error(
          this.translate.instant('products.errors.loadFailed'),
          this.translate.instant('products.errors.title')
        );
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  loadMoreProducts() {
    if (!this.isLoadingMore && this.hasMoreProducts) {
      this.loadProducts(true);
    }
  }

  filterProducts() {
    if (!this.selectedCategory) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        product => product.category.name === this.selectedCategory
      );
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.createProduct(result).subscribe({
          next: () => {
            this.toastr.success(
              this.translate.instant('products.success.added'),
              this.translate.instant('products.success.title')
            );
            this.loadProducts();
          },
          error: (error) => {
            this.toastr.error(
              this.translate.instant('products.errors.addFailed'),
              this.translate.instant('products.errors.title')
            );
          }
        });
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
        this.productService.updateProduct(product.id, result).subscribe({
          next: () => {
            this.toastr.success(
              this.translate.instant('products.success.updated'),
              this.translate.instant('products.success.title')
            );
            this.loadProducts();
          },
          error: (error) => {
            this.toastr.error(
              this.translate.instant('products.errors.updateFailed'),
              this.translate.instant('products.errors.title')
            );
          }
        });
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
        productName: productName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.toastr.success(
              this.translate.instant('products.success.deleted'),
              this.translate.instant('products.success.title')
            );
            this.loadProducts();
          },
          error: (error) => {
            this.toastr.error(
              this.translate.instant('products.errors.deleteFailed'),
              this.translate.instant('products.errors.title')
            );
          }
        });
      }
    });
  }
}