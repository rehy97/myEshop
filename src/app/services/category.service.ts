import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../enviroments/enviroment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlingService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category)
      .pipe(
        catchError(error => this.errorService.handleHttpError(error))
      );
  }

  deleteCategory(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => true),
        catchError(error => this.errorService.handleHttpError(error))
      );
  }
}