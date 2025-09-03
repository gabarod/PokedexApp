import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ 'register' | translate }}</h1>
          <p>{{ 'registerSubtitle' | translate }}</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">{{ 'name' | translate }}</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name"
                [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                [placeholder]="'namePlaceholder' | translate"
              >
              <div class="error-message" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                {{ 'nameRequired' | translate }}
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">{{ 'lastName' | translate }}</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName"
                [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                [placeholder]="'lastNamePlaceholder' | translate"
              >
              <div class="error-message" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                {{ 'lastNameRequired' | translate }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              placeholder="usuario@ejemplo.com"
            >
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">El correo es obligatorio</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Formato de correo inválido</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Teléfono (Opcional)</label>
              <input 
                type="tel" 
                id="phone" 
                formControlName="phone"
                placeholder="123-456-7890"
              >
            </div>

            <div class="form-group">
              <label for="city">Ciudad (Opcional)</label>
              <input 
                type="text" 
                id="city" 
                formControlName="city"
                placeholder="Tu ciudad"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
            >
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">La contraseña es obligatoria</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Mínimo 8 caracteres</span>
              <span *ngIf="registerForm.get('password')?.errors?.['pattern']">Debe contener al menos 1 mayúscula, 1 minúscula y 1 número</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              placeholder="Repite tu contraseña"
            >
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">La confirmación es obligatoria</span>
            </div>
            <div class="error-message" *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">
              Las contraseñas no coinciden
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary auth-btn" 
            [disabled]="registerForm.invalid || loading"
          >
            <span *ngIf="!loading">Registrarse</span>
            <span *ngIf="loading">Registrando...</span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
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
      max-width: 500px;
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
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        
        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }
      }
      
      .form-group {
        margin-bottom: 20px;
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
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const userData = this.registerForm.value;
      delete userData.confirmPassword; // Remove confirmation field

      this.authService.register(userData).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.router.navigate(['/login'], {
              queryParams: { message: 'Registro exitoso. Ahora puedes iniciar sesión.' }
            });
          } else {
            this.errorMessage = 'Ya existe una cuenta con este email.';
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error al registrar la cuenta. Inténtalo nuevamente.';
        }
      });
    }
  }
}