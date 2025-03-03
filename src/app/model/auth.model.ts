export interface AuthResponse {
    access_token: string;
    refresh_token: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    avatar: string;
  }