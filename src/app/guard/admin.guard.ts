import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
  })
  export class AdminGuard implements CanActivate {
    constructor(
      private authService: AuthService,
      private router: Router,
      private toastr: ToastrService,
      private translate: TranslateService
    ) {}
  
    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if (this.authService.isLoggedIn()) {
        const user = this.authService.getCurrentUser();
        if (user && user.role === 'admin') {
          return true;
        }
        
        this.toastr.error(
          this.translate.instant('auth.adminRequired'),
          this.translate.instant('auth.accessDenied')
        );
        return this.router.createUrlTree(['/']);
      }
      
      this.toastr.error(
        this.translate.instant('auth.loginRequired'),
        this.translate.instant('auth.accessDenied')
      );
      return this.router.createUrlTree(['/login']);
    }
  }