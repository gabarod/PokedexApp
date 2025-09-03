import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="container">
      <div class="home-header">
        <h1>{{ 'dashboardTitle' | translate }}</h1>
        <p>{{ 'dashboardSubtitle' | translate }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalCaptured }}</div>
          <div class="stat-label">{{ 'totalCaptured' | translate }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.occupationPercentage }}%</div>
          <div class="stat-label">{{ 'pokedexCompleted' | translate }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.averageLevel }}</div>
          <div class="stat-label">{{ 'averageLevel' | translate }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.favoriteType }}</div>
          <div class="stat-label">{{ 'favoriteType' | translate }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalExperience | number }}</div>
          <div class="stat-label">{{ 'totalExperience' | translate }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ stats.strongestPokemon?.name || ('none' | translate) }}</div>
          <div class="stat-label">{{ 'strongestPokemon' | translate }}</div>
        </div>
      </div>

      <div class="sections-grid">
        <div class="section-card">
          <h3>{{ 'myPokemon' | translate }}</h3>
          <p class="section-subtitle">{{ 'lastFourAdded' | translate }}</p>
          
          <div class="pokemon-mini-grid" *ngIf="stats.lastFourPokemon.length > 0; else noPokemon">
            <div class="mini-pokemon-card" *ngFor="let pokemon of stats.lastFourPokemon">
              <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
              <span class="pokemon-name">{{ pokemon.name }}</span>
            </div>
          </div>
          
          <ng-template #noPokemon>
            <div class="empty-state">
              <i class="fas fa-plus-circle"></i>
              <p>{{ 'noPokemonYet' | translate }}</p>
            </div>
          </ng-template>
        </div>

        <div class="section-card">
          <h3>{{ 'recommended' | translate }}</h3>
          <p class="section-subtitle">{{ 'topStrongPokemon' | translate }}</p>
          
          <div class="pokemon-mini-grid" *ngIf="recommendedPokemon.length > 0; else loadingRecommended">
            <div class="mini-pokemon-card" *ngFor="let pokemon of recommendedPokemon">
              <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
              <span class="pokemon-name">{{ pokemon.name }}</span>
              <span class="pokemon-attack">ATK: {{ getPokemonAttack(pokemon) }}</span>
            </div>
          </div>
          
          <ng-template #loadingRecommended>
            <div class="loading">
              <div class="spinner"></div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-header {
      text-align: center;
      margin-bottom: 40px;
      color: white;
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 8px;
        font-weight: 700;
      }
      
      p {
        font-size: 1.1rem;
        opacity: 0.9;
      }
    }

    .sections-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .section-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      
      h3 {
        color: #1f2937;
        margin-bottom: 8px;
        font-size: 1.5rem;
      }
      
      .section-subtitle {
        color: #6b7280;
        margin-bottom: 20px;
        font-size: 0.9rem;
      }
    }

    .pokemon-mini-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .mini-pokemon-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        background: #f3f4f6;
      }
      
      img {
        width: 60px;
        height: 60px;
        object-fit: contain;
        margin-bottom: 8px;
      }
      
      .pokemon-name {
        display: block;
        font-weight: 500;
        color: #374151;
        text-transform: capitalize;
        font-size: 0.9rem;
      }
      
      .pokemon-attack {
        display: block;
        font-size: 0.8rem;
        color: #ef4444;
        font-weight: 600;
        margin-top: 4px;
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
      
      i {
        font-size: 3rem;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      p {
        margin: 0;
        font-size: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  stats: any = {
    totalCaptured: 0,
    occupationPercentage: 0,
    averageLevel: 0,
    favoriteType: 'Ninguno',
    totalExperience: 0,
    strongestPokemon: null,
    lastFourPokemon: []
  };
  recommendedPokemon: Pokemon[] = [];
  private recommendationInterval: any;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecommendedPokemon();
    
    // Update recommendations every 10 minutes
    this.recommendationInterval = setInterval(() => {
      this.loadRecommendedPokemon();
    }, 10 * 60 * 1000);
  }

  ngOnDestroy(): void {
    if (this.recommendationInterval) {
      clearInterval(this.recommendationInterval);
    }
  }

  private loadStats(): void {
    this.pokemonService.userData$.subscribe(userData => {
      if (userData) {
        this.stats = this.pokemonService.getPokedexStats();
      }
    });
  }

  private loadRecommendedPokemon(): void {
    this.pokemonService.getTop100StrongestPokemon().subscribe(topPokemon => {
      // Get 2 random Pokemon from top 100
      const shuffled = topPokemon.sort(() => 0.5 - Math.random());
      this.recommendedPokemon = shuffled.slice(0, 2);
    });
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  getPokemonAttack(pokemon: Pokemon): number {
    return pokemon.stats?.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  }
}