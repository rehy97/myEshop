import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    avatar: ''
  };

  confirmPassword = '';
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  passwordRequirements = {
    length: false,
    letter: false,
    number: false
  };
  
  checkPasswordRequirements(password: string) {
    this.passwordRequirements = {
      length: password.length >= 4,
      letter: /[A-Za-z]/.test(password),
      number: /[0-9]/.test(password)
    };
  }
  
  // Upravte existující validační vzory
  validationPatterns = {
    email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
    name: '^[A-Za-žÀ-ž\\s]{2,30}$',
    password: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    // Generate random avatar URL on component initialization
    this.userData.avatar = this.authService.generateAvatarUrl();
  }

  passwordsMatch(): boolean {
    return this.userData.password === this.confirmPassword;
  }

  isFieldValid(field: any): boolean {
    return field?.valid && (field?.dirty || field?.touched);
  }

  async onSubmit(form: NgForm) {
    if (this.isLoading || !form.valid || !this.passwordsMatch()) return;
    
    this.isLoading = true;
    
    try {
      await this.authService.register(this.userData).toPromise();
      
      this.toastr.success(
        this.translate.instant('register.success'),
        this.translate.instant('register.title')
      );
      
      // Navigate to login page after successful registration
      this.router.navigate(['/login']);
    } catch (error) {
      let errorMessage = this.translate.instant('register.errors.generic');
      
      if ((error as any).status === 409) {
        errorMessage = this.translate.instant('register.errors.emailExists');
      } else if ((error as any).status === 400) {
        errorMessage = this.translate.instant('register.errors.invalidData');
      }
      
      this.toastr.error(errorMessage, this.translate.instant('register.title'));
    } finally {
      this.isLoading = false;
    }
  }
}