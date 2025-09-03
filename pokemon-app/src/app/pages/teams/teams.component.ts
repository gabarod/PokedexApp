import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { Team } from '../../models/pokemon.model';
import { NewTeamModalComponent } from '../../components/new-team-modal/new-team-modal.component';
import { AddPokemonModalComponent } from '../../components/add-pokemon-modal/add-pokemon-modal.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, NewTeamModalComponent, AddPokemonModalComponent],
  template: `
    <div class="container">
      <div class="teams-header">
        <h1>Mi Equipo</h1>
        <button class="btn btn-primary" (click)="showNewTeamModal = true">
          <i class="fas fa-plus"></i> Nuevo Equipo
        </button>
      </div>

      <div class="teams-grid" *ngIf="teams.length > 0; else noTeams">
        <div class="team-card" *ngFor="let team of teams">
          <div class="team-header">
            <h3 class="team-name">{{ team.name }}</h3>
            <div class="team-actions">
              <button class="btn-icon" (click)="deleteTeam(team.id)" title="Eliminar equipo">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="team-metrics">
            <div class="metric-card capacity">
              <div class="metric-header">
                <i class="fas fa-users"></i>
                <span>Capacidad</span>
              </div>
              <div class="metric-value">{{ team.pokemons.length }}/{{ team.limit }}</div>
            </div>

            <div class="metric-card power" *ngIf="team.pokemons.length > 0">
              <div class="metric-header">
                <i class="fas fa-bolt"></i>
                <span>Poder Total</span>
              </div>
              <div class="metric-value">{{ getTeamTotalPower(team) }}</div>
            </div>

            <div class="metric-card level" *ngIf="team.pokemons.length > 0">
              <div class="metric-header">
                <i class="fas fa-star"></i>
                <span>Nivel Prom.</span>
              </div>
              <div class="metric-value">{{ getTeamAverageLevel(team) }}</div>
            </div>
          </div>

          <div class="team-detailed-stats" *ngIf="team.pokemons.length > 0">
            <div class="stats-grid">
              <div class="stat-item attack">
                <i class="fas fa-sword"></i>
                <div class="stat-info">
                  <span class="stat-label">ATK</span>
                  <span class="stat-value">{{ getTeamTotalStat(team, 'attack') }}</span>
                </div>
              </div>
              <div class="stat-item defense">
                <i class="fas fa-shield"></i>
                <div class="stat-info">
                  <span class="stat-label">DEF</span>
                  <span class="stat-value">{{ getTeamTotalStat(team, 'defense') }}</span>
                </div>
              </div>
              <div class="stat-item speed">
                <i class="fas fa-tachometer-alt"></i>
                <div class="stat-info">
                  <span class="stat-label">SPD</span>
                  <span class="stat-value">{{ getTeamTotalStat(team, 'speed') }}</span>
                </div>
              </div>
              <div class="stat-item hp">
                <i class="fas fa-heart"></i>
                <div class="stat-info">
                  <span class="stat-label">HP</span>
                  <span class="stat-value">{{ getTeamTotalStat(team, 'hp') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="team-composition" *ngIf="team.pokemons.length > 0">
            <div class="composition-header">
              <i class="fas fa-palette"></i>
              <span>Composición de Tipos</span>
            </div>
            <div class="types-grid">
              <div 
                *ngFor="let typeData of getTeamTypesWithCount(team)" 
                class="type-card"
                [class]="'type-' + typeData.type"
              >
                <span class="type-name">{{ typeData.type | titlecase }}</span>
                <span class="type-count">{{ typeData.count }}</span>
              </div>
            </div>
            <div class="strongest-pokemon" *ngIf="getStrongestPokemon(team)">
              <div class="strongest-header">
                <i class="fas fa-crown"></i>
                <span>Más Fuerte</span>
              </div>
              <div class="strongest-info">
                <img [src]="getPokemonImage(getStrongestPokemon(team))" [alt]="getStrongestPokemon(team).name" />
                <span class="pokemon-name">{{ getStrongestPokemon(team).name | titlecase }}</span>
              </div>
            </div>
          </div>

          <div class="team-pokemon-gallery">
            <div class="gallery-header">
              <span>Pokémon en el Equipo</span>
              <button 
                *ngIf="team.pokemons.length < team.limit" 
                class="btn-add-pokemon" 
                (click)="openAddPokemonToTeam(team.id)"
                title="Agregar Pokémon"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="pokemon-grid">
              <div class="pokemon-slot filled" *ngFor="let pokemon of team.pokemons">
                <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
                <span class="pokemon-name">{{ pokemon.name | titlecase }}</span>
              </div>
              <div 
                *ngFor="let slot of getEmptySlots(team)" 
                class="pokemon-slot empty" 
                (click)="openAddPokemonToTeam(team.id)"
              >
                <i class="fas fa-plus"></i>
                <span>Vacío</span>
              </div>
            </div>
          </div>

          <div class="team-footer">
            <button class="btn btn-primary" [routerLink]="['/teams', team.id]">
              Ver Detalle
            </button>
          </div>
        </div>
      </div>

      <ng-template #noTeams>
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No tienes equipos creados</h3>
          <p>Crea tu primer equipo haciendo clic en "Nuevo Equipo"</p>
        </div>
      </ng-template>
    </div>

    <app-new-team-modal 
      *ngIf="showNewTeamModal"
      (close)="showNewTeamModal = false"
      (teamCreated)="onTeamCreated()"
    ></app-new-team-modal>

    <app-add-pokemon-modal 
      *ngIf="showAddPokemonModal"
      [mode]="'team'"
      [teamId]="selectedTeamId"
      (close)="closeAddPokemonModal()"
      (pokemonAdded)="onPokemonAddedToTeam()"
    ></app-add-pokemon-modal>
  `,
  styles: [`
    .teams-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      color: white;
      
      h1 {
        font-size: 2.5rem;
        margin: 0;
        font-weight: 700;
      }
    }

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .team-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .team-name {
        margin: 0;
        color: #1f2937;
        font-size: 1.3rem;
      }
      
      .team-actions {
        .btn-icon {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #ef4444;
          border-radius: 4px;
          transition: background-color 0.3s ease;
          
          &:hover {
            background: #fee2e2;
          }
        }
      }
    }

    .team-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;

      .metric-card {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.capacity {
          border-left: 4px solid #3b82f6;
        }

        &.power {
          border-left: 4px solid #ef4444;
        }

        &.level {
          border-left: 4px solid #f59e0b;
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;

          i {
            font-size: 0.9rem;
          }
        }

        .metric-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
        }
      }
    }

    .team-detailed-stats {
      margin-bottom: 20px;

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;

          &.attack {
            border-left: 3px solid #ef4444;
          }

          &.defense {
            border-left: 3px solid #3b82f6;
          }

          &.speed {
            border-left: 3px solid #10b981;
          }

          &.hp {
            border-left: 3px solid #f59e0b;
          }

          i {
            color: #6b7280;
            font-size: 1rem;
          }

          .stat-info {
            display: flex;
            flex-direction: column;

            .stat-label {
              font-size: 0.7rem;
              color: #6b7280;
              font-weight: 500;
            }

            .stat-value {
              font-size: 1rem;
              font-weight: 600;
              color: #1f2937;
            }
          }
        }
      }
    }

    .team-composition {
      margin-bottom: 20px;

      .composition-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 0.9rem;
        color: #6b7280;
        font-weight: 500;

        i {
          color: #3b82f6;
        }
      }

      .types-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;

        .type-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          min-width: 60px;

          .type-name {
            color: white;
          }

          .type-count {
            background: rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            margin-left: 6px;
          }
        }
      }

      .strongest-pokemon {
        background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%);
        border-radius: 8px;
        padding: 12px;
        
        .strongest-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 0.8rem;
          color: #92400e;
          font-weight: 600;

          i {
            color: #f59e0b;
          }
        }

        .strongest-info {
          display: flex;
          align-items: center;
          gap: 8px;

          img {
            width: 32px;
            height: 32px;
            object-fit: contain;
            border-radius: 4px;
          }

          .pokemon-name {
            font-weight: 600;
            color: #92400e;
          }
        }
      }
    }

    .team-pokemon-gallery {
      margin-bottom: 20px;

      .gallery-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 0.9rem;
        color: #6b7280;
        font-weight: 500;

        .btn-add-pokemon {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background-color 0.3s ease;

          &:hover {
            background: #2563eb;
          }
        }
      }

      .pokemon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;

        .pokemon-slot {
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          transition: all 0.3s ease;

          &.filled {
            background: #f8fafc;
            border: 1px solid #e2e8f0;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            img {
              width: 100%;
              height: 60%;
              object-fit: contain;
              margin-bottom: 4px;
            }

            .pokemon-name {
              font-size: 0.7rem;
              font-weight: 500;
              color: #1f2937;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
            }
          }

          &.empty {
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            cursor: pointer;
            color: #9ca3af;

            &:hover {
              border-color: #3b82f6;
              color: #3b82f6;
              background: #eff6ff;
            }

            i {
              font-size: 1.2rem;
              margin-bottom: 4px;
            }

            span {
              font-size: 0.7rem;
              font-weight: 500;
            }
          }
        }
      }
    }

    .team-footer {
      .btn {
        width: 100%;
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
      
      i {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.7;
      }
      
      h3 {
        margin: 0 0 16px 0;
        font-size: 1.5rem;
      }
      
      p {
        margin: 0;
        opacity: 0.8;
      }
    }

    @media (max-width: 768px) {
      .teams-header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .teams-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  showNewTeamModal = false;
  showAddPokemonModal = false;
  selectedTeamId: string = '';

  constructor(
    private pokemonService: PokemonService,
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  private loadTeams(): void {
    this.pokemonService.userData$.subscribe(userData => {
      if (userData) {
        this.teams = userData.teams;
      }
    });
  }

  deleteTeam(teamId: string): void {
    this.notificationService.showConfirmation(
      this.translationService.translate('confirmDeleteTeam') || '¿Estás seguro de que deseas eliminar este equipo?',
      () => {
        this.pokemonService.deleteTeam(teamId);
      }
    );
  }

  getTeamTotalStat(team: Team, statName: string): number {
    return team.pokemons.reduce((total, pokemon) => {
      const stat = pokemon.stats?.find(s => s.stat.name === statName)?.base_stat || 0;
      return total + stat;
    }, 0);
  }

  getTeamTotalPower(team: Team): number {
    return team.pokemons.reduce((total, pokemon) => {
      const attack = pokemon.stats?.find(s => s.stat.name === 'attack')?.base_stat || 0;
      const spAttack = pokemon.stats?.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
      return total + Math.max(attack, spAttack);
    }, 0);
  }

  getTeamAverageLevel(team: Team): number {
    if (team.pokemons.length === 0) return 0;
    const totalLevel = team.pokemons.reduce((total, pokemon) => {
      // Calculate pseudo-level based on base stats total
      const statsTotal = pokemon.stats?.reduce((sum, stat) => sum + stat.base_stat, 0) || 0;
      return total + Math.floor(statsTotal / 15); // Approximate level
    }, 0);
    return Math.round(totalLevel / team.pokemons.length);
  }

  getTeamTypes(team: Team): string[] {
    const typesSet = new Set<string>();
    team.pokemons.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          typesSet.add(typeInfo.type.name);
        });
      }
    });
    return Array.from(typesSet).sort();
  }

  getTeamTypesWithCount(team: Team): Array<{type: string, count: number}> {
    const typesMap = new Map<string, number>();
    team.pokemons.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;
          typesMap.set(typeName, (typesMap.get(typeName) || 0) + 1);
        });
      }
    });
    
    return Array.from(typesMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  getStrongestPokemon(team: Team): any {
    if (team.pokemons.length === 0) return null;
    return team.pokemons.reduce((strongest, pokemon) => {
      const pokemonPower = pokemon.stats?.reduce((sum, stat) => sum + stat.base_stat, 0) || 0;
      const strongestPower = strongest.stats?.reduce((sum: number, stat: any) => sum + stat.base_stat, 0) || 0;
      return pokemonPower > strongestPower ? pokemon : strongest;
    });
  }

  getEmptySlots(team: Team): number[] {
    const emptyCount = team.limit - team.pokemons.length;
    return Array.from({ length: emptyCount }, (_, i) => i);
  }

  getPokemonImage(pokemon: any): string {
    return pokemon.sprites?.other['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  onTeamCreated(): void {
    this.loadTeams();
  }

  openAddPokemonToTeam(teamId: string): void {
    this.selectedTeamId = teamId;
    this.showAddPokemonModal = true;
  }

  closeAddPokemonModal(): void {
    this.showAddPokemonModal = false;
    this.selectedTeamId = '';
  }

  onPokemonAddedToTeam(): void {
    this.loadTeams();
    this.closeAddPokemonModal();
  }
}