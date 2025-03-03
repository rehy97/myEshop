import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ProductComponent } from './component/product/product.component';
import { AuthGuard } from './guard/auth.guard';
import { LoggedInGuard } from './guard/logged-in.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page',
    canActivate: [LoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register Page',
    canActivate: [LoggedInGuard],
  },
  {
    path: 'products',
    component: ProductComponent,
    title: 'Products Page',
    canActivate: [AuthGuard] 
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];