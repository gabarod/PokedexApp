import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotificationModalComponent, NotificationData } from './components/notification-modal/notification-modal.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, NotificationModalComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="showNavbar" (logout)="onLogout()"></app-navbar>
      <main [class.with-navbar]="showNavbar">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Global Notification Modal -->
      <app-notification-modal
        *ngIf="currentNotification"
        [message]="currentNotification.message"
        [type]="currentNotification.type"
        [showCancel]="currentNotification.showCancel || false"
        (confirm)="onNotificationConfirm()"
        (cancel)="onNotificationCancel()">
      </app-notification-modal>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    main {
      flex: 1;
      padding: 20px;
      
      &.with-navbar {
        padding-top: 80px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  showNavbar = false;
  currentNotification: NotificationData | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.showNavbar = !!user;
    });

    // Subscribe to notifications
    this.notificationService.notification$.subscribe(notification => {
      this.currentNotification = notification;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onNotificationConfirm() {
    if (this.currentNotification?.onConfirm) {
      this.currentNotification.onConfirm();
    }
    this.notificationService.hideNotification();
  }

  onNotificationCancel() {
    if (this.currentNotification?.onCancel) {
      this.currentNotification.onCancel();
    }
    this.notificationService.hideNotification();
  }
}