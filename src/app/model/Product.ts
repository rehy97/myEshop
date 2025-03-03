import { Category } from "./Category"; // Ensure Category is properly exported from Category.ts

export interface Product {
  id: number; // Unique product identifier
  title: string; // Name of the product
  price: number; // Price of the product
  description: string; // Description of the product
  category: Category; // Category of the product, linked by the category object
  images: string[]; // List of image URLs associated with the product
}