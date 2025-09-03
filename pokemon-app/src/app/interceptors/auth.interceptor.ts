import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Add authentication headers if user is logged in
  let authReq = req;
  
  if (authService.isLoggedIn()) {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer mock-token-${currentUser.id}`,
          'X-User-ID': currentUser.id
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle authentication errors
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Handle other HTTP errors
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};