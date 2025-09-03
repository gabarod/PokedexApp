export interface Pokemon {
  id: number;
  name: string;
  url?: string;
  sprites?: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  base_experience?: number;
  height?: number;
  weight?: number;
}

export interface PokemonListResponse {
  count: number;
  results: Pokemon[];
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  role?: import('./user.model').UserRole;
}

export interface Team {
  id: string;
  name: string;
  limit: number;
  pokemons: Pokemon[];
  userId: string;
}

export interface UserData {
  user: User;
  pokedex: Pokemon[];
  teams: Team[];
}