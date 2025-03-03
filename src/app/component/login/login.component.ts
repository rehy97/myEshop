// login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TranslateModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  hidePassword = true;
  isLoading = false;
  rememberMe = false;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      this.credentials.email = JSON.parse(remembered).email;
      this.rememberMe = true;
    }
  }

  async onSubmit(form: NgForm) {
    if (this.isLoading || !form.valid) return;
    
    this.isLoading = true;
    
    try {
      const response = await this.authService.login(this.credentials).toPromise();
      
      if (this.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ 
          email: this.credentials.email 
        }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      this.toastr.success(
        this.translate.instant('login.success'),
        this.translate.instant('login.title')
      );
      
      this.router.navigate(['/']);
    } catch (error) {
      let errorMessage = this.translate.instant('login.errors.generic');
      
      if ((error as any).status === 401) {
        errorMessage = this.translate.instant('login.errors.invalid');
      }
      
      this.toastr.error(errorMessage, this.translate.instant('login.title'));
    } finally {
      this.isLoading = false;
    }
  }
}