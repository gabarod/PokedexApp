import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pokedex',
    loadComponent: () => import('./pages/pokedex/pokedex.component').then(m => m.PokedexComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    loadComponent: () => import('./pages/teams/teams.component').then(m => m.TeamsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'teams/:id',
    loadComponent: () => import('./pages/team-detail/team-detail.component').then(m => m.TeamDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];