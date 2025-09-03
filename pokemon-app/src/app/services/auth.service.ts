import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserData } from '../models/pokemon.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeTestUser();
    this.loadUserFromStorage();
  }

  private initializeTestUser(): void {
    const users = this.getAllUsers();
    if (users.length === 0) {
      // Create default test user
      const testUser: User = {
        id: 'test-user-1',
        name: 'Usuario',
        lastName: 'Prueba',
        email: 'test@pokemon.com',
        phone: '123-456-7890',
        city: 'Ciudad Pokémon',
        role: UserRole.TRAINER
      };
      
      users.push(testUser);
      localStorage.setItem('pokemon-app-users', JSON.stringify(users));
      
      // Initialize test user data
      const testUserData: UserData = {
        user: testUser,
        pokedex: [],
        teams: []
      };
      localStorage.setItem(`pokemon-app-data-${testUser.id}`, JSON.stringify(testUserData));
    }
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('pokemon-app-user');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string, rememberSession: boolean = false): Observable<boolean> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);
        
        if (user && password.length > 0) {
          this.currentUserSubject.next(user);
          
          if (rememberSession) {
            localStorage.setItem('pokemon-app-user', JSON.stringify(user));
          } else {
            sessionStorage.setItem('pokemon-app-user', JSON.stringify(user));
          }
          
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  register(userData: Partial<User>): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getAllUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
          observer.next(false);
        } else {
          const newUser: User = {
            id: Date.now().toString(),
            name: userData.name!,
            lastName: userData.lastName!,
            email: userData.email!,
            phone: userData.phone,
            city: userData.city
          };
          
          users.push(newUser);
          localStorage.setItem('pokemon-app-users', JSON.stringify(users));
          
          // Initialize user data
          const userDataObj: UserData = {
            user: newUser,
            pokedex: [],
            teams: []
          };
          localStorage.setItem(`pokemon-app-data-${newUser.id}`, JSON.stringify(userDataObj));
          
          observer.next(true);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('pokemon-app-user');
    sessionStorage.removeItem('pokemon-app-user');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  private getAllUsers(): User[] {
    const users = localStorage.getItem('pokemon-app-users');
    return users ? JSON.parse(users) : [];
  }
}