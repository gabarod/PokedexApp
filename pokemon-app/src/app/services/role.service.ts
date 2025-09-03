import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole, UserPermissions } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentUserPermissions = new BehaviorSubject<UserPermissions | null>(null);
  public userPermissions$ = this.currentUserPermissions.asObservable();

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const permissions = this.getUserPermissions(user.role || UserRole.VISITOR);
        this.currentUserPermissions.next(permissions);
      } else {
        this.currentUserPermissions.next(null);
      }
    });
  }

  private getUserPermissions(role: UserRole): UserPermissions {
    switch (role) {
      case UserRole.ADMIN:
        return {
          canManageUsers: true,
          canManageAllTeams: true,
          canViewAnalytics: true,
          canModifyPokemon: true,
          maxTeams: Infinity,
          maxPokemonPerTeam: Infinity
        };
        
      case UserRole.TRAINER:
        return {
          canManageUsers: false,
          canManageAllTeams: false,
          canViewAnalytics: false,
          canModifyPokemon: false,
          maxTeams: 10,
          maxPokemonPerTeam: 6
        };
        
      case UserRole.VISITOR:
      default:
        return {
          canManageUsers: false,
          canManageAllTeams: false,
          canViewAnalytics: false,
          canModifyPokemon: false,
          maxTeams: 3,
          maxPokemonPerTeam: 3
        };
    }
  }

  getCurrentPermissions(): UserPermissions | null {
    return this.currentUserPermissions.value;
  }

  hasPermission(permission: keyof UserPermissions): boolean {
    const permissions = this.getCurrentPermissions();
    if (!permissions) return false;
    
    return permissions[permission] as boolean;
  }

  canCreateTeam(): boolean {
    const permissions = this.getCurrentPermissions();
    if (!permissions) return false;
    
    return true;
  }

  getMaxTeams(): number {
    const permissions = this.getCurrentPermissions();
    return permissions?.maxTeams || 0;
  }

  getMaxPokemonPerTeam(): number {
    const permissions = this.getCurrentPermissions();
    return permissions?.maxPokemonPerTeam || 0;
  }

  assignRole(userId: string, role: UserRole): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }
}