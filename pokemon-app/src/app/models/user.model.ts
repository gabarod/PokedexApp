export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer', 
  VISITOR = 'visitor'
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageAllTeams: boolean;
  canViewAnalytics: boolean;
  canModifyPokemon: boolean;
  maxTeams: number;
  maxPokemonPerTeam: number;
}