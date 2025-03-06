import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../enviroments/enviroment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlingService
  ) {}

  getProducts(
    offset: number = 0,
    limit: number = 12,
    title?: string,
    categoryId?: number,
    price_min?: number,
    price_max?: number
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());
      
    if (title && title.trim() !== '') {
      params = params.set('title', title);
    }
    
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    
    if (price_min !== undefined && price_min !== null) {
      params = params.set('price_min', price_min.toString());
    }
    
    if (price_max !== undefined && price_max !== null) {
      params = params.set('price_max', price_max.toString());
    }
  
    return this.http.get<Product[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  createProduct(product: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  updateProduct(id: number, changes: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, changes)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }
}