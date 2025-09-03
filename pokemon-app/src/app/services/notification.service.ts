import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string): void {
    this.showNotification({
      message,
      type: 'success',
      showCancel: false
    });
  }

  showError(message: string): void {
    this.showNotification({
      message,
      type: 'error',
      showCancel: false
    });
  }

  showWarning(message: string): void {
    this.showNotification({
      message,
      type: 'warning',
      showCancel: false
    });
  }

  showInfo(message: string): void {
    this.showNotification({
      message,
      type: 'info',
      showCancel: false
    });
  }

  showConfirmation(
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    type: 'warning' | 'error' | 'info' = 'warning'
  ): void {
    this.showNotification({
      message,
      type,
      showCancel: true,
      onConfirm,
      onCancel
    });
  }

  private showNotification(data: NotificationData): void {
    this.notificationSubject.next(data);
  }

  hideNotification(): void {
    this.notificationSubject.next(null);
  }

  // Legacy method to replace alert() calls
  alert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.showNotification({
      message,
      type,
      showCancel: false
    });
  }

  // Legacy method to replace confirm() calls
  confirm(
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ): void {
    this.showConfirmation(message, onConfirm, onCancel, 'warning');
  }
}