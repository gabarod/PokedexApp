import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="notification-overlay" (click)="onCancel()">
      <div class="notification-modal" (click)="$event.stopPropagation()" [class]="type">
        <div class="notification-header">
          <div class="notification-icon">
            <i [class]="getIcon()"></i>
          </div>
          <h3 class="notification-title">{{ getTitle() | translate }}</h3>
        </div>
        
        <div class="notification-body">
          <p class="notification-message">{{ message }}</p>
        </div>
        
        <div class="notification-actions">
          <button 
            class="notification-btn primary" 
            (click)="onConfirm()"
            [attr.aria-label]="getConfirmText() | translate">
            {{ getConfirmText() | translate }}
          </button>
          <button 
            *ngIf="showCancel" 
            class="notification-btn secondary" 
            (click)="onCancel()"
            [attr.aria-label]="'cancel' | translate">
            {{ 'cancel' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(3px);
    }

    .notification-modal {
      background: white;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      min-width: 400px;
      max-width: 500px;
      margin: 20px;
      overflow: hidden;
      animation: modalAppear 0.3s ease-out;
      border-top: 4px solid;
    }

    .notification-modal.success {
      border-top-color: #10b981;
    }

    .notification-modal.error {
      border-top-color: #ef4444;
    }

    .notification-modal.warning {
      border-top-color: #f59e0b;
    }

    .notification-modal.info {
      border-top-color: #3b82f6;
    }

    @keyframes modalAppear {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .notification-header {
      padding: 24px 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #f3f4f6;
    }

    .notification-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .success .notification-icon {
      background: #10b981;
    }

    .error .notification-icon {
      background: #ef4444;
    }

    .warning .notification-icon {
      background: #f59e0b;
    }

    .info .notification-icon {
      background: #3b82f6;
    }

    .notification-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .notification-body {
      padding: 16px 24px;
    }

    .notification-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: #6b7280;
    }

    .notification-actions {
      padding: 16px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .notification-btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      min-width: 80px;
    }

    .notification-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .notification-btn.primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .notification-btn.secondary {
      background: #f3f4f6;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }

    .notification-btn.secondary:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .notification-btn:active {
      transform: translateY(0);
    }

    .notification-btn:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .notification-modal {
        min-width: 320px;
        max-width: 90vw;
        margin: 10px;
      }

      .notification-header {
        padding: 20px 20px 12px;
      }

      .notification-body {
        padding: 12px 20px;
      }

      .notification-actions {
        padding: 12px 20px 20px;
        flex-direction: column;
      }

      .notification-btn {
        width: 100%;
      }
    }
  `]
})
export class NotificationModalComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() showCancel: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getIcon(): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[this.type];
  }

  getTitle(): string {
    const titles = {
      success: 'notificationSuccess',
      error: 'notificationError',
      warning: 'notificationWarning',
      info: 'notificationInfo'
    };
    return titles[this.type];
  }

  getConfirmText(): string {
    if (this.showCancel) {
      return this.type === 'error' || this.type === 'warning' ? 'notificationConfirm' : 'notificationAccept';
    }
    return 'notificationOk';
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}