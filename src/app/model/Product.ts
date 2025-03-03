import { Category } from "./Category"; // Ensure Category is properly exported from Category.ts

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface CreateProductDTO {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface UpdateProductDTO {
  title?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  images?: string[];
}