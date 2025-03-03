import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoryService } from '../../service/category.service';
import { Product } from '../../model/Product';
import { Category } from '../../model/Category';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  get imageControls() {
    return (this.productForm.get('images') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private categoryService: CategoryService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data?: Product
  ) {
    this.productForm = this.createForm();
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnInit() {
    this.loadCategories();
    if (this.data) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      images: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  private loadCategories() {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Failed to load categories:', error);
        }
      });
  }

  private populateForm() {
    if (!this.data) {
      return;
    }

    const imagesArray = this.productForm.get('images') as FormArray;
    
    while (imagesArray.length) {
      imagesArray.removeAt(0);
    }

    let processedImages: string[] = [];
    
    if (this.data.images) {
        const images: any = this.data.images;  // explicitní typování
        if (typeof images === 'string') {
            try {
                let cleaned = images.replace(/[\[\]"]/g, '');
                processedImages = [cleaned];
            } catch (e) {
                processedImages = [images];
            }
        } else if (Array.isArray(images)) {
            processedImages = images.map((url: string) => url.replace(/["\[\]]/g, ''));
        }
    }

    processedImages.forEach(imageUrl => {
        imagesArray.push(this.fb.control(imageUrl, Validators.required));
    });

    this.productForm.patchValue({
        title: this.data.title || '',
        description: this.data.description || '',
        price: this.data.price || 0,
        categoryId: this.data.category?.id || null
    });
}
  addImage() {
    const imagesArray = this.productForm.get('images') as FormArray;
    imagesArray.push(this.fb.control('', Validators.required));
  }

  removeImage(index: number) {
    const imagesArray = this.productForm.get('images') as FormArray;
    imagesArray.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.productForm.value;
      
      // Ensure images array doesn't contain empty strings
      formValue.images = formValue.images.filter((url: string) => url.trim());
      
      this.dialogRef.close(formValue);
    }
  }
}