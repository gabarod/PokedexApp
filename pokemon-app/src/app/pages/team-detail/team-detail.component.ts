import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { Team, Pokemon } from '../../models/pokemon.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="container" *ngIf="team">
      <div class="team-header">
        <button class="btn btn-secondary back-btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> {{ 'goBack' | translate }}
        </button>
        <div class="team-title">
          <h1>{{ team.name }}</h1>
          <p>{{ team.pokemons.length }}/{{ team.limit }} Pokémon</p>
        </div>
      </div>

      <div class="team-stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ getTotalStat('attack') }}</div>
          <div class="stat-label">{{ 'totalAttack' | translate }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalStat('defense') }}</div>
          <div class="stat-label">{{ 'totalDefense' | translate }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalStat('speed') }}</div>
          <div class="stat-label">{{ 'totalSpeed' | translate }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalStat('hp') }}</div>
          <div class="stat-label">{{ 'totalHP' | translate }}</div>
        </div>
      </div>

      <div class="team-types" *ngIf="team.pokemons.length > 0">
        <h3>{{ 'typeDistribution' | translate }}</h3>
        <div class="types-grid">
          <span 
            *ngFor="let type of getTeamTypes()" 
            class="pokemon-type type-badge"
            [class]="'type-' + type"
          >
            {{ type | titlecase }}
          </span>
        </div>
      </div>

      <div class="pokemon-section">
        <h3>{{ 'teamPokemon' | translate }}</h3>
        
        <div class="pokemon-grid" *ngIf="team.pokemons.length > 0; else emptyTeam">
          <div class="pokemon-card detailed" *ngFor="let pokemon of team.pokemons">
            <div class="pokemon-image">
              <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
            </div>
            
            <div class="pokemon-info">
              <h4 class="pokemon-name">{{ pokemon.name | titlecase }}</h4>
              <div class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</div>
              
              <div class="pokemon-types">
                <span 
                  *ngFor="let type of pokemon.types" 
                  class="pokemon-type"
                  [class]="'type-' + type.type.name"
                >
                  {{ type.type.name | titlecase }}
                </span>
              </div>

              <div class="pokemon-stats-detail">
                <div class="stat-row">
                  <span class="stat-name">HP:</span>
                  <span class="stat-value">{{ getPokemonStat(pokemon, 'hp') }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">ATK:</span>
                  <span class="stat-value attack">{{ getPokemonStat(pokemon, 'attack') }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">DEF:</span>
                  <span class="stat-value defense">{{ getPokemonStat(pokemon, 'defense') }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-name">SPD:</span>
                  <span class="stat-value speed">{{ getPokemonStat(pokemon, 'speed') }}</span>
                </div>
              </div>

              <button 
                class="btn btn-danger remove-btn" 
                (click)="removePokemon(pokemon.id)"
              >
                <i class="fas fa-times"></i> {{ 'remove' | translate }}
              </button>
            </div>
          </div>
        </div>

        <ng-template #emptyTeam>
          <div class="empty-state">
            <i class="fas fa-plus-circle"></i>
            <h4>{{ 'emptyTeam' | translate }}</h4>
            <p>{{ 'addPokemonToTeam' | translate }}</p>
          </div>
        </ng-template>
      </div>
    </div>

    <div class="container" *ngIf="!team">
      <div class="loading">
        <div class="spinner"></div>
        <p>{{ 'loadingTeam' | translate }}</p>
      </div>
    </div>
  `,
  styles: [`
    .team-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      color: white;
      
      .back-btn {
        flex-shrink: 0;
      }
      
      .team-title {
        h1 {
          font-size: 2.5rem;
          margin: 0 0 8px 0;
          font-weight: 700;
        }
        
        p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }
      }
    }

    .team-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .team-types {
      margin-bottom: 40px;
      
      h3 {
        color: white;
        margin-bottom: 16px;
        font-size: 1.5rem;
      }
      
      .types-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .type-badge {
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 600;
        }
      }
    }

    .pokemon-section {
      h3 {
        color: white;
        margin-bottom: 20px;
        font-size: 1.5rem;
      }
    }

    .pokemon-card.detailed {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .pokemon-image {
        margin-bottom: 16px;
        
        img {
          width: 120px;
          height: 120px;
          object-fit: contain;
        }
      }
      
      .pokemon-info {
        text-align: center;
        width: 100%;
        
        .pokemon-name {
          color: #1f2937;
          margin: 0 0 8px 0;
          font-size: 1.2rem;
        }
        
        .pokemon-id {
          color: #6b7280;
          margin-bottom: 12px;
        }
        
        .pokemon-types {
          margin-bottom: 16px;
        }
        
        .pokemon-stats-detail {
          background: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          
          .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .stat-name {
              font-weight: 500;
              color: #6b7280;
            }
            
            .stat-value {
              font-weight: 600;
              
              &.attack { color: #ef4444; }
              &.defense { color: #3b82f6; }
              &.speed { color: #10b981; }
            }
          }
        }
        
        .remove-btn {
          padding: 8px 16px;
          font-size: 0.9rem;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      
      i {
        font-size: 3rem;
        margin-bottom: 16px;
        opacity: 0.7;
      }
      
      h4 {
        margin: 0 0 8px 0;
        font-size: 1.3rem;
      }
      
      p {
        margin: 0;
        opacity: 0.8;
      }
    }

    @media (max-width: 768px) {
      .team-header {
        flex-direction: column;
        text-align: center;
        
        .team-title {
          h1 {
            font-size: 2rem;
          }
        }
      }
      
      .team-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .pokemon-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  team: Team | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeam(teamId);
    }
  }

  private loadTeam(teamId: string): void {
    this.pokemonService.userData$.subscribe(userData => {
      if (userData) {
        this.team = userData.teams.find(team => team.id === teamId) || null;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }

  getTotalStat(statName: string): number {
    if (!this.team) return 0;
    return this.team.pokemons.reduce((total, pokemon) => {
      const stat = pokemon.stats?.find(s => s.stat.name === statName)?.base_stat || 0;
      return total + stat;
    }, 0);
  }

  getTeamTypes(): string[] {
    if (!this.team) return [];
    
    const typesSet = new Set<string>();
    this.team.pokemons.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          typesSet.add(typeInfo.type.name);
        });
      }
    });
    return Array.from(typesSet).sort();
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  getPokemonStat(pokemon: Pokemon, statName: string): number {
    return pokemon.stats?.find(stat => stat.stat.name === statName)?.base_stat || 0;
  }

  removePokemon(pokemonId: number): void {
    if (this.team) {
      this.notificationService.showConfirmation(
        this.translationService.translate('confirmRemovePokemon') || '¿Estás seguro de que deseas remover este Pokémon del equipo?',
        () => {
          this.pokemonService.removePokemonFromTeam(this.team!.id, pokemonId);
        }
      );
    }
  }
}