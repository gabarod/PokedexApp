import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PokemonService } from '../../services/pokemon.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationService } from '../../services/notification.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { User } from '../../models/pokemon.model';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  template: `
    <div class="modal" (click)="close.emit()">
      <div class="modal-content profile-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2><i class="fas fa-user-circle"></i> {{ 'userProfile' | translate }}</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="profile-content">
          <div class="profile-sections">
            <!-- Avatar Section -->
            <div class="avatar-section">
              <div class="avatar-container">
                <img [src]="userAvatar" [alt]="currentUser?.name" class="user-avatar">
                <div class="avatar-badges">
                  <span class="role-badge" [class]="'role-' + (currentUser?.role || 'visitor')">
                    {{ getRoleDisplay(currentUser?.role) }}
                  </span>
                  <span class="level-badge">
                    <i class="fas fa-star"></i> {{ 'level' | translate }} {{ userLevel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- User Info Form -->
            <div class="info-section">
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                <div class="form-grid">
                  <div class="form-group">
                    <label>{{ 'firstName' | translate }}</label>
                    <input type="text" formControlName="name" class="form-control">
                    <div class="error-message" *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
                      {{ 'nameRequired' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ 'lastName' | translate }}</label>
                    <input type="text" formControlName="lastName" class="form-control">
                    <div class="error-message" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                      {{ 'lastNameRequired' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ 'email' | translate }}</label>
                    <input type="email" formControlName="email" class="form-control">
                    <div class="error-message" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                      {{ 'emailInvalid' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ 'phone' | translate }}</label>
                    <input type="tel" formControlName="phone" class="form-control">
                  </div>

                  <div class="form-group">
                    <label>{{ 'city' | translate }}</label>
                    <input type="text" formControlName="city" class="form-control">
                  </div>

                  <div class="form-group">
                    <label>{{ 'favoriteLanguage' | translate }}</label>
                    <select class="form-control" [value]="currentLanguage" (change)="changeLanguage($event)">
                      <option *ngFor="let lang of availableLanguages" [value]="lang.code">
                        {{ lang.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="stats-section">
            <h3>{{ 'trainerStats' | translate }}</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-book"></i></div>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.totalPokemon }}</span>
                  <span class="stat-label">{{ 'totalPokemon' | translate }}</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.totalTeams }}</span>
                  <span class="stat-label">{{ 'totalTeams' | translate }}</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.battlesWon }}</span>
                  <span class="stat-label">{{ 'battlesWon' | translate }}</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-info">
                  <span class="stat-value">{{ getDaysActive() }}</span>
                  <span class="stat-label">{{ 'daysActive' | translate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button type="button" class="btn btn-primary" (click)="saveProfile()" [disabled]="profileForm.invalid">
              <i class="fas fa-save"></i> {{ 'saveChanges' | translate }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              <i class="fas fa-undo"></i> {{ 'resetChanges' | translate }}
            </button>
            <button type="button" class="btn btn-danger" (click)="showDeleteConfirmation = true">
              <i class="fas fa-trash"></i> {{ 'deleteAccount' | translate }}
            </button>
          </div>

          <!-- Delete Confirmation -->
          <div class="delete-confirmation" *ngIf="showDeleteConfirmation">
            <div class="confirmation-content">
              <h4>{{ 'confirmDelete' | translate }}</h4>
              <p>{{ 'deleteAccountWarning' | translate }}</p>
              <div class="confirmation-buttons">
                <button class="btn btn-danger" (click)="deleteAccount()">
                  {{ 'delete' | translate }}
                </button>
                <button class="btn btn-secondary" (click)="showDeleteConfirmation = false">
                  {{ 'cancel' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      overflow-y: auto;
      padding: 20px 0;
    }

    .profile-modal {
      max-width: 800px;
      width: 95%;
      max-height: 95vh;
      overflow-y: auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 20px 20px 0 0;
      border-bottom: 3px solid #667eea;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
    }

    .profile-content {
      padding: 30px;
      color: white;
    }

    .profile-sections {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .avatar-section {
      text-align: center;
    }

    .avatar-container {
      position: relative;
      display: inline-block;
    }

    .user-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .avatar-badges {
      margin-top: 15px;
    }

    .role-badge, .level-badge {
      display: block;
      margin: 5px 0;
      padding: 6px 12px;
      border-radius: 15px;
      font-weight: bold;
      font-size: 0.8rem;
    }

    .role-badge.role-admin {
      background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    }

    .role-badge.role-trainer {
      background: linear-gradient(45deg, #4ecdc4, #44a08d);
    }

    .role-badge.role-visitor {
      background: linear-gradient(45deg, #a8edea, #fed6e3);
      color: #333;
    }

    .level-badge {
      background: linear-gradient(45deg, #feca57, #ff9ff3);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group:nth-child(3),
    .form-group:nth-child(6) {
      grid-column: 1 / -1;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .form-control:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    .error-message {
      color: #ff6b6b;
      font-size: 0.8rem;
      margin-top: 5px;
    }

    .stats-section {
      margin-bottom: 30px;
    }

    .stats-section h3 {
      margin-bottom: 20px;
      font-size: 1.3rem;
      text-align: center;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      font-weight: bold;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
    }

    .stat-card {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 15px;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      background: rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #feca57;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .stat-label {
      font-size: 0.8rem;
      color: #ffffff;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
    }

    .btn-primary {
      background: linear-gradient(45deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .btn-secondary {
      background: linear-gradient(45deg, #6b7280, #4b5563);
      color: white;
    }

    .btn-danger {
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .delete-confirmation {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      border-radius: 15px;
      padding: 30px;
      z-index: 1001;
      max-width: 400px;
      width: 90%;
    }

    .confirmation-content h4 {
      color: #ff6b6b;
      margin-bottom: 15px;
      text-align: center;
    }

    .confirmation-content p {
      margin-bottom: 20px;
      text-align: center;
      color: white;
    }

    .confirmation-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .profile-sections {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class UserProfileModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  profileForm!: FormGroup;
  currentUser: User | null = null;
  userAvatar = 'https://www.gravatar.com/avatar/placeholder?d=mp&s=150';
  userLevel = 1;
  currentLanguage = '';
  availableLanguages: any[] = [];
  showDeleteConfirmation = false;

  userStats = {
    totalPokemon: 0,
    totalTeams: 0,
    battlesWon: 0,
    daysActive: 0
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pokemonService: PokemonService,
    private translationService: TranslationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
    this.loadUserStats();
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.availableLanguages = this.translationService.getAvailableLanguages();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: ['']
    });
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone || '',
        city: this.currentUser.city || ''
      });
      
      this.userLevel = Math.floor(this.userStats.totalPokemon / 10) + 1;
    }
  }

  private loadUserStats(): void {
    const userPokedex = this.pokemonService.getUserPokedex();
    let totalTeams = 0;
    
    this.pokemonService.userData$.subscribe(userData => {
      if (userData) {
        totalTeams = userData.teams.length;
      }
    });
    
    this.userStats = {
      totalPokemon: userPokedex.length,
      totalTeams: totalTeams,
      battlesWon: Math.floor(Math.random() * 15),
      daysActive: this.getDaysActive()
    };
  }

  getRoleDisplay(role?: any): string {
    switch (role) {
      case UserRole.ADMIN: return 'Admin';
      case UserRole.TRAINER: return 'Trainer';
      case UserRole.VISITOR: return 'Visitor';
      default: return 'Trainer';
    }
  }

  getDaysActive(): number {
    const now = new Date();
    const created = new Date(2025, 8, 1);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  changeLanguage(event: any): void {
    const newLanguage = event.target.value;
    this.translationService.setLanguage(newLanguage);
    this.currentLanguage = newLanguage;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      console.log('Saving profile:', formData);
      this.notificationService.showSuccess(this.translationService.translate('profileSaved'));
    }
  }

  resetForm(): void {
    this.loadUserData();
  }

  deleteAccount(): void {
    console.log('Deleting account...');
    this.notificationService.showInfo(this.translationService.translate('accountDeletion'));
    this.showDeleteConfirmation = false;
    this.close.emit();
  }
}