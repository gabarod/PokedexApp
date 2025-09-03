import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, UserProfileModalComponent, TranslatePipe],
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="navbar-brand">
          <h2>Pokédex App</h2>
        </div>
        
        <div class="navbar-menu">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">
            <i class="fas fa-home"></i> {{ 'home' | translate }}
          </a>
          <a routerLink="/pokedex" routerLinkActive="active" class="nav-link">
            <i class="fas fa-book"></i> {{ 'pokedex' | translate }}
          </a>
          <a routerLink="/teams" routerLinkActive="active" class="nav-link">
            <i class="fas fa-users"></i> {{ 'teams' | translate }}
          </a>
        </div>
        
        <div class="navbar-actions">
          <div class="language-selector">
            <select (change)="onLanguageChange($event)" [value]="translationService.getCurrentLanguage()">
              <option *ngFor="let lang of availableLanguages" [value]="lang.code">
                {{ lang.name }}
              </option>
            </select>
          </div>
          <button class="btn btn-info" (click)="openProfileModal()" title="Perfil de Usuario">
            <i class="fas fa-user"></i>
          </button>
          <span class="user-name">{{ (authService.currentUser$ | async)?.name }}</span>
          <button class="btn btn-secondary" (click)="onLogout()">
            <i class="fas fa-sign-out-alt"></i> {{ 'logout' | translate }}
          </button>
        </div>
      </div>
    </nav>

    <app-user-profile-modal
      *ngIf="showProfileModal"
      (close)="showProfileModal = false"
    ></app-user-profile-modal>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 60px;
    }
    
    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    
    .navbar-brand h2 {
      color: #3b82f6;
      margin: 0;
    }
    
    .navbar-menu {
      display: flex;
      gap: 20px;
    }
    
    .nav-link {
      color: #6b7280;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f3f4f6;
        color: #3b82f6;
      }
      
      &.active {
        background: #3b82f6;
        color: white;
      }
      
      i {
        margin-right: 8px;
      }
    }
    
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .language-selector select {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .user-name {
      color: #6b7280;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .navbar-content {
        flex-direction: column;
        height: auto;
        padding: 10px 20px;
      }
      
      .navbar {
        height: auto;
      }
      
      .navbar-menu {
        margin: 10px 0;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>();
  
  availableLanguages = this.translationService.getAvailableLanguages();
  showProfileModal = false;

  constructor(
    public authService: AuthService,
    public translationService: TranslationService
  ) {}

  onLogout() {
    this.logout.emit();
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.translationService.setLanguage(target.value);
  }

  openProfileModal() {
    this.showProfileModal = true;
  }
}