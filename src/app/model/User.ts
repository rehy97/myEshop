export type UserRole = 'customer' | 'admin';

export interface User {
    id: number; // Unique user identifier
    name: string; // Name of the user
    role: UserRole; // Role of the user (either customer or admin)
    email: string; // User's email address
    password: string; // User's password
    avatar: string; // Image URL for user's avatar
  }
