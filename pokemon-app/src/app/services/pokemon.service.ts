import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, UserData, Team } from '../models/pokemon.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  public userData$ = this.userDataSubject.asObservable();
  
  private pokemonCache = new Map<number, Pokemon>();
  private allPokemonList: Pokemon[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadUserData(user.id);
      } else {
        this.userDataSubject.next(null);
      }
    });
  }

  private loadUserData(userId: string): void {
    const data = localStorage.getItem(`pokemon-app-data-${userId}`);
    if (data) {
      this.userDataSubject.next(JSON.parse(data));
    } else {
      const newUserData: UserData = {
        user: this.authService.getCurrentUser()!,
        pokedex: [],
        teams: []
      };
      this.userDataSubject.next(newUserData);
      this.saveUserData(newUserData);
    }
  }

  private saveUserData(userData: UserData): void {
    localStorage.setItem(`pokemon-app-data-${userData.user.id}`, JSON.stringify(userData));
    this.userDataSubject.next(userData);
  }

  // Get all Pokemon (limit to 1000 for performance)
  getAllPokemon(): Observable<Pokemon[]> {
    if (this.allPokemonList.length > 0) {
      return of(this.allPokemonList);
    }

    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=1000`).pipe(
      map(response => response.results.map((pokemon, index) => ({
        ...pokemon,
        id: index + 1
      }))),
      tap(pokemonList => {
        this.allPokemonList = pokemonList;
      })
    );
  }

  // Get Pokemon details
  getPokemonDetails(id: number): Observable<Pokemon> {
    if (this.pokemonCache.has(id)) {
      return of(this.pokemonCache.get(id)!);
    }

    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`).pipe(
      tap(pokemon => {
        this.pokemonCache.set(id, pokemon);
      })
    );
  }

  // Get top 100 strongest Pokemon (by attack stat)
  getTop100StrongestPokemon(): Observable<Pokemon[]> {
    return this.getAllPokemon().pipe(
      switchMap(pokemonList => {
        const requests = pokemonList.slice(0, 150).map(p => 
          this.getPokemonDetails(p.id)
        );
        return forkJoin(requests);
      }),
      map(detailedPokemon => {
        return detailedPokemon
          .filter(p => p.stats && p.stats.length > 0)
          .sort((a, b) => {
            const attackA = a.stats?.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
            const attackB = b.stats?.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
            return attackB - attackA;
          })
          .slice(0, 100);
      })
    );
  }

  // Get user's Pokedex
  getUserPokedex(): Pokemon[] {
    const userData = this.userDataSubject.value;
    return userData ? userData.pokedex : [];
  }

  // Add Pokemon to user's Pokedex
  addPokemonToPokedex(pokemon: Pokemon): void {
    const userData = this.userDataSubject.value;
    if (!userData) return;

    const exists = userData.pokedex.find(p => p.id === pokemon.id);
    if (!exists) {
      userData.pokedex.push(pokemon);
      this.saveUserData(userData);
    }
  }

  // Add multiple Pokemon to Pokedex
  addMultiplePokemonToPokedex(pokemonIds: number[]): Observable<void> {
    return new Observable(observer => {
      const requests = pokemonIds.map(id => this.getPokemonDetails(id));
      
      if (requests.length === 0) {
        observer.next();
        observer.complete();
        return;
      }
      
      forkJoin(requests).subscribe({
        next: (pokemonList) => {
          const userData = this.userDataSubject.value;
          if (userData) {
            pokemonList.forEach(pokemon => {
              const exists = userData.pokedex.find(p => p.id === pokemon.id);
              if (!exists) {
                userData.pokedex.push(pokemon);
              }
            });
            this.saveUserData(userData);
          }
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('Error adding Pokemon to Pokedex:', error);
          observer.error(error);
        }
      });
    });
  }

  // Check if Pokemon is in user's Pokedex
  isPokemonInPokedex(pokemonId: number): boolean {
    const userData = this.userDataSubject.value;
    if (!userData) return false;
    return userData.pokedex.some(p => p.id === pokemonId);
  }

  // Get user's teams
  getUserTeams(): Team[] {
    const userData = this.userDataSubject.value;
    return userData ? userData.teams : [];
  }

  // Create new team
  createTeam(name: string, limit: number): void {
    const userData = this.userDataSubject.value;
    if (!userData) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      limit,
      pokemons: [],
      userId: userData.user.id
    };

    userData.teams.push(newTeam);
    this.saveUserData(userData);
  }

  // Delete team
  deleteTeam(teamId: string): void {
    const userData = this.userDataSubject.value;
    if (!userData) return;

    userData.teams = userData.teams.filter(team => team.id !== teamId);
    this.saveUserData(userData);
  }

  // Add Pokemon to team
  addPokemonToTeam(teamId: string, pokemon: Pokemon): boolean {
    const userData = this.userDataSubject.value;
    if (!userData) return false;

    const team = userData.teams.find(t => t.id === teamId);
    if (!team) return false;

    if (team.pokemons.length >= team.limit) return false;
    if (team.pokemons.find(p => p.id === pokemon.id)) return false;

    team.pokemons.push(pokemon);
    this.saveUserData(userData);
    return true;
  }

  // Remove Pokemon from team
  removePokemonFromTeam(teamId: string, pokemonId: number): void {
    const userData = this.userDataSubject.value;
    if (!userData) return;

    const team = userData.teams.find(t => t.id === teamId);
    if (!team) return;

    team.pokemons = team.pokemons.filter(p => p.id !== pokemonId);
    this.saveUserData(userData);
  }

  // Get team by ID
  getTeamById(teamId: string): Team | undefined {
    const userData = this.userDataSubject.value;
    if (!userData) return undefined;
    return userData.teams.find(team => team.id === teamId);
  }

  // Calculate Pokedex statistics
  getPokedexStats() {
    const userData = this.userDataSubject.value;
    if (!userData || userData.pokedex.length === 0) {
      return {
        totalCaptured: 0,
        occupationPercentage: 0,
        averageLevel: 0,
        favoriteType: 'Ninguno',
        totalExperience: 0,
        strongestPokemon: null,
        lastFourPokemon: []
      };
    }

    const pokedex = userData.pokedex;
    const totalPokemon = 1000; // Total Pokemon in API (approximately)
    
    // Calculate occupation percentage
    const occupationPercentage = (pokedex.length / totalPokemon) * 100;

    // Calculate average level (base experience / 100 as level approximation)
    const averageLevel = pokedex.reduce((sum, pokemon) => {
      return sum + Math.floor((pokemon.base_experience || 0) / 100);
    }, 0) / pokedex.length;

    // Find favorite type
    const typeCount: {[key: string]: number} = {};
    pokedex.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;
          typeCount[typeName] = (typeCount[typeName] || 0) + 1;
        });
      }
    });

    const favoriteType = Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b, 'Ninguno'
    );

    // Calculate total experience
    const totalExperience = pokedex.reduce((sum, pokemon) => {
      return sum + (pokemon.base_experience || 0);
    }, 0);

    // Find strongest Pokemon (by attack stat)
    const strongestPokemon = pokedex.reduce((strongest, current) => {
      if (!current.stats || !strongest.stats) return strongest;
      
      const currentAttack = current.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
      const strongestAttack = strongest.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
      
      return currentAttack > strongestAttack ? current : strongest;
    }, pokedex[0]);

    // Get last 4 Pokemon added
    const lastFourPokemon = pokedex.slice(-4).reverse();

    return {
      totalCaptured: pokedex.length,
      occupationPercentage: Math.round(occupationPercentage * 100) / 100,
      averageLevel: Math.round(averageLevel),
      favoriteType,
      totalExperience,
      strongestPokemon,
      lastFourPokemon
    };
  }
}