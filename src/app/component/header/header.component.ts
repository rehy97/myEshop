import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLang = localStorage.getItem('language') || 'en';
  
  languages = [
    { code: 'en', name: 'English' },
    { code: 'cs', name: 'Čeština' }
  ];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.translate.use(this.currentLang);
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.toastr.info(
      this.translate.instant('header.logoutSuccess'),
      this.translate.instant('header.info')
    );
    this.router.navigate(['/login']);
  }
}