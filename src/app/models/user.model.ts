export type UserRole = 'customer' | 'admin';

export interface User {
    id: number;
    name: string;
    role: UserRole;
    email: string;
    password: string;
    avatar: string;
  }
