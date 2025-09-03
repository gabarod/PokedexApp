import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ 'login' | translate }}</h1>
          <p>{{ 'loginSubtitle' | translate }}</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">{{ 'email' | translate }}</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              [placeholder]="'emailPlaceholder' | translate"
            >
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">{{ 'emailRequired' | translate }}</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">{{ 'emailInvalid' | translate }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">{{ 'password' | translate }}</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              [placeholder]="'passwordPlaceholder' | translate"
            >
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">{{ 'passwordRequired' | translate }}</span>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberSession">
              <span class="checkmark"></span>
              {{ 'rememberSession' | translate }}
            </label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary auth-btn" 
            [disabled]="loginForm.invalid || loading"
          >
            <span *ngIf="!loading">{{ 'login' | translate }}</span>
            <span *ngIf="loading">{{ 'loading' | translate }}</span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>{{ 'noAccount' | translate }} <a routerLink="/register">{{ 'registerHere' | translate }}</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
      
      h1 {
        color: #1f2937;
        margin-bottom: 8px;
        font-size: 2rem;
        font-weight: 700;
      }
      
      p {
        color: #6b7280;
        margin: 0;
      }
    }

    .auth-form {
      .form-group {
        margin-bottom: 20px;
      }
      
      .checkbox-group {
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          
          input[type="checkbox"] {
            margin-right: 8px;
          }
        }
      }
      
      .auth-btn {
        width: 100%;
        padding: 14px;
        font-size: 16px;
        font-weight: 600;
        margin-top: 8px;
      }
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      
      p {
        margin: 0;
        color: #6b7280;
        
        a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberSession: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password, rememberSession } = this.loginForm.value;

      this.authService.login(email, password, rememberSession).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error al intentar iniciar sesión. Inténtalo nuevamente.';
        }
      });
    }
  }
}