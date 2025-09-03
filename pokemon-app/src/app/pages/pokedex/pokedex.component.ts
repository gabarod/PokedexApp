import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { AddPokemonModalComponent } from '../../components/add-pokemon-modal/add-pokemon-modal.component';
import { PokemonDetailModalComponent } from '../../components/pokemon-detail-modal/pokemon-detail-modal.component';
import { BattleSimulatorModalComponent } from '../../components/battle-simulator-modal/battle-simulator-modal.component';
import { PokemonComparisonModalComponent } from '../../components/pokemon-comparison-modal/pokemon-comparison-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, AddPokemonModalComponent, PokemonDetailModalComponent, BattleSimulatorModalComponent, PokemonComparisonModalComponent, TranslatePipe],
  template: `
    <div class="container">
      <div class="pokedex-header">
        <h1>{{ 'pokedex' | translate }}</h1>
        <div class="header-actions">
          <div class="view-toggle">
            <label>{{ 'viewMode' | translate }}:</label>
            <div class="toggle-group">
              <button 
                class="btn"
                [class.btn-primary]="showMyPokemonOnly"
                [class.btn-outline-primary]="!showMyPokemonOnly"
                (click)="togglePokemonView(true)"
              >
                {{ 'myPokemon' | translate }}
              </button>
              <button 
                class="btn"
                [class.btn-primary]="!showMyPokemonOnly"
                [class.btn-outline-primary]="showMyPokemonOnly"
                [disabled]="loading"
                (click)="togglePokemonView(false)"
              >
                {{ 'allPokemon' | translate }}
              </button>
            </div>
          </div>
          <div class="pokemon-count">
            <span class="count">{{ filteredPokemon.length }}</span>
            <span class="label">{{ showMyPokemonOnly ? ('pokemonInPokedex' | translate) : ('pokemonAvailable' | translate) }}</span>
          </div>
          <button class="btn btn-primary" (click)="showAddModal = true">
            <i class="fas fa-plus"></i> {{ 'addPokemon' | translate }}
          </button>
        </div>
      </div>

      <div class="filters">
        <div class="filters-row">
          <div class="form-group">
            <label>{{ 'viewMode' | translate }}</label>
            <div class="toggle-group">
              <button 
                class="btn"
                [class.btn-primary]="showMyPokemonOnly"
                [class.btn-secondary]="!showMyPokemonOnly"
                (click)="togglePokemonView(true)"
              >
                {{ 'myPokemon' | translate }}
              </button>
              <button 
                class="btn"
                [class.btn-primary]="!showMyPokemonOnly"
                [class.btn-secondary]="showMyPokemonOnly"
                (click)="togglePokemonView(false)"
                [disabled]="loading"
              >
                {{ 'allPokemon' | translate }}
                <i *ngIf="loading" class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ 'search' | translate }}</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
              [placeholder]="'searchByNameType' | translate"
            >
          </div>
          
          <div class="form-group">
            <label>{{ 'filterByType' | translate }}</label>
            <select [(ngModel)]="selectedType" (change)="applyFilters()">
              <option value="">{{ 'allTypes' | translate }}</option>
              <option *ngFor="let type of pokemonTypes" [value]="type">{{ type | titlecase }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ 'filterByGeneration' | translate }}</label>
            <select [(ngModel)]="selectedGeneration" (change)="applyFilters()">
              <option value="">{{ 'allGenerations' | translate }}</option>
              <option value="1">Gen I - Kanto (1-151)</option>
              <option value="2">Gen II - Johto (152-251)</option>
              <option value="3">Gen III - Hoenn (252-386)</option>
              <option value="4">Gen IV - Sinnoh (387-493)</option>
              <option value="5">Gen V - Unova (494-649)</option>
              <option value="6">Gen VI - Kalos (650-721)</option>
              <option value="7">Gen VII - Alola (722-809)</option>
              <option value="8">Gen VIII - Galar (810-905)</option>
              <option value="9">Gen IX - Paldea (906-1025)</option>
            </select>
            <div class="generation-info" *ngIf="selectedGeneration">
              <small class="generation-details">
                <i class="fas fa-info-circle"></i>
                {{ getGenerationName(getSelectedGenerationNumber()) }} | IDs: {{ getGenerationRange(getSelectedGenerationNumber()) }}
                <button class="btn-clear-gen" (click)="clearGenerationFilter()" title="Limpiar filtro de generación">
                  <i class="fas fa-times"></i>
                </button>
              </small>
              <div class="generation-stats" *ngIf="getGenerationStats()">
                <small class="stats-details">
                  <i class="fas fa-chart-bar"></i>
                  Promedio: {{ getGenerationStats()?.averageStats }} | 
                  <i class="fas fa-crown"></i>
                  Más fuerte: {{ getGenerationStats()?.strongest?.name }}
                </small>
                <small class="generation-details-info" *ngIf="getGenerationDetails()">
                  <i class="fas fa-gamepad"></i>
                  {{ getGenerationDetails()?.games }} | 
                  <i class="fas fa-calendar"></i>
                  {{ getGenerationDetails()?.years }}
                </small>
                <small class="generation-total-info">
                  <i class="fas fa-pokeball"></i>
                  Total en generación: {{ getGenerationTotal(getSelectedGenerationNumber()) }} | 
                  Mostrando: {{ filteredPokemon.length }}
                </small>
              </div>
            </div>
          </div>

          <div class="form-group">
            <button class="btn btn-secondary" (click)="clearFilters()">
              <i class="fas fa-times"></i> {{ 'clearFilters' | translate }}
            </button>
          </div>
        </div>
      </div>

      <div class="pokemon-grid" *ngIf="filteredPokemon.length > 0; else noPokemon">
        <div class="pokemon-card" *ngFor="let pokemon of filteredPokemon">
          <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
          <div class="pokemon-info">
            <h3 class="pokemon-name">{{ pokemon.name | titlecase }}</h3>
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
            <div class="pokemon-stats" *ngIf="pokemon.stats">
              <div class="stat">
                <span class="stat-label">HP:</span>
                <span class="stat-value">{{ getPokemonStat(pokemon, 'hp') }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">ATK:</span>
                <span class="stat-value">{{ getPokemonStat(pokemon, 'attack') }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">DEF:</span>
                <span class="stat-value">{{ getPokemonStat(pokemon, 'defense') }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">SPD:</span>
                <span class="stat-value">{{ getPokemonStat(pokemon, 'speed') }}</span>
              </div>
            </div>
            <div class="pokemon-total-stats" *ngIf="pokemon.stats">
              <span class="total-label">Total:</span>
              <span class="total-value">{{ getTotalStats(pokemon) }}</span>
            </div>

            <div class="pokemon-actions">
              <button 
                class="btn btn-info btn-sm action-btn"
                (click)="openDetailModal(pokemon)"
                [title]="'pokemonDetail' | translate"
              >
                <i class="fas fa-info-circle"></i>
                <span class="btn-text">{{ 'pokemonDetail' | translate }}</span>
              </button>
              <button 
                class="btn btn-secondary btn-sm action-btn"
                (click)="openBattleModal(pokemon)"
                [title]="'battleSimulator' | translate"
              >
                <i class="fas fa-sword"></i>
                <span class="btn-text">{{ 'battleSimulator' | translate }}</span>
              </button>
              <button 
                class="btn btn-warning btn-sm action-btn"
                (click)="openComparisonModal(pokemon)"
                [title]="'comparePokemon' | translate"
              >
                <i class="fas fa-balance-scale"></i>
                <span class="btn-text">{{ 'comparePokemon' | translate }}</span>
              </button>
              <button 
                *ngIf="!showMyPokemonOnly && !isPokemonCaptured(pokemon)"
                class="btn btn-success btn-sm action-btn"
                (click)="addPokemonToPokedex(pokemon)"
                [title]="'capturePokemon' | translate"
              >
                <i class="fas fa-plus"></i>
                <span class="btn-text">{{ 'capturePokemon' | translate }}</span>
              </button>
            </div>
            <div *ngIf="!showMyPokemonOnly" class="capture-status">
              <span 
                class="status-badge"
                [class.captured]="isPokemonCaptured(pokemon)"
                [class.available]="!isPokemonCaptured(pokemon)"
              >
                {{ isPokemonCaptured(pokemon) ? ('captured' | translate) : ('available' | translate) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noPokemon>
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3 *ngIf="showMyPokemonOnly && userPokemon.length === 0">{{ 'emptyPokedex' | translate }}</h3>
          <h3 *ngIf="!(showMyPokemonOnly && userPokemon.length === 0)">{{ 'noPokemonFoundFilter' | translate }}</h3>
          <p *ngIf="showMyPokemonOnly && userPokemon.length === 0">
            {{ 'startCatchingPokemon' | translate }}
          </p>
          <p *ngIf="!(showMyPokemonOnly && userPokemon.length === 0)">
            {{ 'noResultsFilter' | translate }}
          </p>
        </div>
      </ng-template>
    </div>

    <app-add-pokemon-modal 
      *ngIf="showAddModal"
      (close)="showAddModal = false"
      (pokemonAdded)="onPokemonAdded()"
    ></app-add-pokemon-modal>

    <app-pokemon-detail-modal
      *ngIf="showDetailModal" 
      [pokemon]="selectedPokemonForDetail"
      (close)="showDetailModal = false"
      (openBattleModal)="openBattleWithPokemon($event)"
      (openComparisonModal)="openComparisonWithPokemon($event)"
    ></app-pokemon-detail-modal>

    <app-battle-simulator-modal
      *ngIf="showBattleModal" 
      [initialPokemon]="selectedPokemonForBattle"
      (close)="showBattleModal = false"
    ></app-battle-simulator-modal>

    <app-pokemon-comparison-modal
      *ngIf="showComparisonModal" 
      [initialPokemon]="selectedPokemonForComparison"
      (close)="showComparisonModal = false"
      (openBattleModal)="openBattleWithTwoPokemon($event)"
    ></app-pokemon-comparison-modal>
  `,
  styles: [`
    .pokedex-header {
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
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      
      .pokemon-count {
        text-align: center;
        
        .count {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #fbbf24;
        }
        
        .label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
      }
    }

    .pokemon-info {
      padding: 16px 0;
      
      .pokemon-name {
        margin: 8px 0;
        font-size: 1.2rem;
        color: #1f2937;
      }
      
      .pokemon-id {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 12px;
      }
      
      .pokemon-types {
        margin-bottom: 12px;
      }
      
      .pokemon-stats {
        display: flex;
        justify-content: space-around;
        
        .stat {
          text-align: center;
          
          .stat-label {
            font-size: 0.8rem;
            color: #6b7280;
          }
          
          .stat-value {
            display: block;
            font-weight: 600;
            color: #1f2937;
          }
        }
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

    .view-toggle {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      label {
        font-weight: 600;
        font-size: 0.9rem;
        color: #374151;
      }
    }

    .toggle-group {
      display: flex;
      border-radius: 6px;
      overflow: hidden;
      
      .btn {
        margin: 0;
        border-radius: 0;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        
        &:last-child {
          border-right: none;
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    // Pokemon Type Styles
    .pokemon-type {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      color: white;
      margin-right: 4px;
      
      &.type-normal { background-color: #A8A878; }
      &.type-fire { background-color: #F08030; }
      &.type-water { background-color: #6890F0; }
      &.type-electric { background-color: #F8D030; }
      &.type-grass { background-color: #78C850; }
      &.type-ice { background-color: #98D8D8; }
      &.type-fighting { background-color: #C03028; }
      &.type-poison { background-color: #A040A0; }
      &.type-ground { background-color: #E0C068; }
      &.type-flying { background-color: #A890F0; }
      &.type-psychic { background-color: #F85888; }
      &.type-bug { background-color: #A8B820; }
      &.type-rock { background-color: #B8A038; }
      &.type-ghost { background-color: #705898; }
      &.type-dragon { background-color: #7038F8; }
      &.type-dark { background-color: #705848; }
      &.type-steel { background-color: #B8B8D0; }
      &.type-fairy { background-color: #EE99AC; }
    }

    @media (max-width: 768px) {
      .pokedex-header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
        
        .header-actions {
          flex-direction: column;
          gap: 16px;
        }
      }

      .pokemon-actions {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;

        .btn {
          padding: 6px 8px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;

          &.btn-info {
            background-color: #3b82f6;
            color: white;
            &:hover { background-color: #2563eb; }
          }

          &.btn-secondary {
            background-color: #6b7280;
            color: white;
            &:hover { background-color: #4b5563; }
          }

          &.btn-warning {
            background-color: #f59e0b;
            color: white;
            &:hover { background-color: #d97706; }
          }

          i {
            font-size: 0.9rem;
          }
        }
      }
    }

    .capture-status {
      margin-top: 8px;
      text-align: center;

      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;

        &.captured {
          background-color: #10b981;
          color: white;
        }

        &.available {
          background-color: #6b7280;
          color: white;
        }
      }
    }

    .pokemon-total-stats {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 0.85rem;
      
      .total-label {
        font-weight: 600;
        color: #6b7280;
      }
      
      .total-value {
        font-weight: 700;
        color: #1f2937;
        margin-left: 4px;
      }
    }

    .pokemon-actions {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.75rem;
        min-width: 80px;
        position: relative;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:active {
          transform: translateY(0);
        }

        i {
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .btn-text {
          font-weight: 600;
          line-height: 1.2;
          text-align: center;
        }

        &.btn-info {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #2563eb, #1e40af);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        }

        &.btn-secondary {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #4b5563, #374151);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }

        &.btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #d97706, #b45309);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          }
        }

        &.btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #059669, #047857);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        }

        // Efecto de brillo al hacer hover
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        &:hover::before {
          left: 100%;
        }
      }
    }

    .generation-info {
      margin-top: 8px;
      
      .generation-details {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #6b7280;
        font-size: 0.8rem;
        
        i {
          color: #3b82f6;
        }
        
        .btn-clear-gen {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.2s;
          margin-left: 8px;
          
          &:hover {
            background-color: #fee2e2;
            color: #dc2626;
          }
          
          i {
            font-size: 0.7rem;
          }
        }
      }
      
      .generation-stats {
        margin-top: 4px;
        
                  .stats-details {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #059669;
            font-size: 0.75rem;
            
            i {
              color: #f59e0b;
              
              &.fa-chart-bar {
                color: #8b5cf6;
              }
              
              &.fa-crown {
                color: #fbbf24;
              }
            }
          }
          
          .generation-details-info {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #7c3aed;
            font-size: 0.7rem;
            margin-top: 2px;
            
            i {
              color: #8b5cf6;
              
              &.fa-gamepad {
                color: #ec4899;
              }
              
              &.fa-calendar {
                color: #06b6d4;
              }
            }
          }
          
          .generation-total-info {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #dc2626;
            font-size: 0.7rem;
            margin-top: 2px;
            
            i {
              color: #ef4444;
              
              &.fa-pokeball {
                color: #dc2626;
              }
            }
          }
      }
    }

    .form-group {
      select {
        &:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      }
    }
  `]
})
export class PokedexComponent implements OnInit {
  userPokemon: Pokemon[] = [];
  allPokemon: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  pokemonTypes: string[] = [];
  
  searchTerm: string = '';
  selectedType: string = '';
  selectedGeneration: string = '';
  showMyPokemonOnly: boolean = true;
  loading: boolean = false;
  
  showAddModal = false;
  showDetailModal = false;
  showBattleModal = false;
  showComparisonModal = false;
  selectedPokemonForDetail: Pokemon | null = null;
  selectedPokemonForBattle: Pokemon | null = null;
  selectedPokemonForComparison: Pokemon | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadUserPokemon();
  }

  private loadUserPokemon(): void {
    this.pokemonService.userData$.subscribe(userData => {
      if (userData && userData.pokedex) {
        this.userPokemon = Array.isArray(userData.pokedex) ? userData.pokedex : [];
        this.filteredPokemon = [...this.userPokemon];
        this.extractPokemonTypes();
      } else {
        this.userPokemon = [];
        this.filteredPokemon = [];
        this.pokemonTypes = [];
      }
    });
  }

  private extractPokemonTypes(): void {
    this.extractAllPokemonTypes();
  }

  togglePokemonView(showMyPokemonOnly: boolean): void {
    this.showMyPokemonOnly = showMyPokemonOnly;
    
    if (!showMyPokemonOnly && this.allPokemon.length === 0) {
      if (this.selectedGeneration) {
        const gen = parseInt(this.selectedGeneration);
        if (!isNaN(gen)) {
          this.loadPokemonByGeneration(gen);
        } else {
          this.loadAllPokemon();
        }
      } else {
        this.loadAllPokemon();
      }
    } else {
      this.applyFilters();
    }
  }

  private loadAllPokemon(): void {
    this.loading = true;
    this.pokemonService.getTop100StrongestPokemon().subscribe(pokemon => {
      if (pokemon && Array.isArray(pokemon)) {
        this.allPokemon = pokemon;
        this.extractAllPokemonTypes();
        this.applyFilters();
      }
      this.loading = false;
    });
  }

  private extractAllPokemonTypes(): void {
    const typesSet = new Set<string>();
    const currentPokemonList = this.showMyPokemonOnly ? this.userPokemon : this.allPokemon;
    
    if (!currentPokemonList || currentPokemonList.length === 0) {
      this.pokemonTypes = [];
      return;
    }
    
    currentPokemonList.forEach(pokemon => {
      if (pokemon && pokemon.types && Array.isArray(pokemon.types)) {
        pokemon.types.forEach(typeInfo => {
          if (typeInfo && typeInfo.type && typeInfo.type.name) {
            typesSet.add(typeInfo.type.name);
          }
        });
      }
    });
    
    this.pokemonTypes = Array.from(typesSet).sort();
  }

  applyFilters(): void {
    const currentPokemonList = this.showMyPokemonOnly ? this.userPokemon : this.allPokemon;
    
    if (this.selectedGeneration && !this.showMyPokemonOnly && this.allPokemon.length === 0) {
      const gen = parseInt(this.selectedGeneration);
      if (!isNaN(gen)) {
        this.loadPokemonByGeneration(gen);
        return;
      }
    }
    
    if (!currentPokemonList || currentPokemonList.length === 0) {
      this.filteredPokemon = [];
      return;
    }
    
    this.filteredPokemon = currentPokemonList.filter(pokemon => {
      const matchesSearch = this.matchesSearch(pokemon);
      const matchesType = this.matchesType(pokemon);
      const matchesGeneration = this.matchesGeneration(pokemon);
      
      return matchesSearch && matchesType && matchesGeneration;
    });
  }

  private matchesSearch(pokemon: Pokemon): boolean {
    if (!this.searchTerm.trim()) return true;
    
    const searchLower = this.searchTerm.toLowerCase();
    const nameMatch = pokemon.name.toLowerCase().includes(searchLower);
    const typeMatch = pokemon.types?.some(type => 
      type.type.name.toLowerCase().includes(searchLower)
    ) || false;
    
    return nameMatch || typeMatch;
  }

  private matchesType(pokemon: Pokemon): boolean {
    if (!this.selectedType) return true;
    
    return pokemon.types?.some(type => 
      type.type.name === this.selectedType
    ) || false;
  }

  private matchesGeneration(pokemon: Pokemon): boolean {
    try {
    if (!this.selectedGeneration) return true;
    
    const gen = parseInt(this.selectedGeneration);
      if (isNaN(gen)) return true;
      
    const pokemonId = pokemon.id;
      if (!pokemonId || pokemonId <= 0) return false;
      
      // Usar el rango calculado para mayor consistencia
      const range = this.getGenerationRange(gen);
      if (!range) return true;
      
      const [start, end] = range.split('-').map(Number);
      const matches = pokemonId >= start && pokemonId <= end;
      
      
      return matches;
    } catch (error) {
      console.error('Error in matchesGeneration:', error, pokemon);
      return true;
    }
  }

  clearFilters(): void {
    try {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedGeneration = '';
    this.applyFilters();
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  }

  clearGenerationFilter(): void {
    try {
      this.selectedGeneration = '';
      this.applyFilters();
    } catch (error) {
      console.error('Error clearing generation filter:', error);
    }
  }

  getPokemonImage(pokemon: Pokemon): string {
    try {
      if (!pokemon || !pokemon.id) {
        return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
      }
      
      const officialArtwork = pokemon.sprites?.other?.['official-artwork']?.front_default;
      if (officialArtwork) {
        return officialArtwork;
      }
      
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    } catch (error) {
      console.error('Error getting Pokemon image:', error, pokemon);
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    }
  }

  getPokemonStat(pokemon: Pokemon, statName: string): number {
    try {
      if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) return 0;
      
      const stat = pokemon.stats.find(s => s && s.stat && s.stat.name === statName);
      return stat && typeof stat.base_stat === 'number' ? stat.base_stat : 0;
    } catch (error) {
      console.error('Error getting Pokemon stat:', error, pokemon, statName);
      return 0;
    }
  }

  onPokemonAdded(): void {
    try {
    console.log('Pokemon added event received, reloading user pokemon');
    this.loadUserPokemon();
    this.applyFilters(); // Refresh the filtered list
    } catch (error) {
      console.error('Error handling Pokemon added event:', error);
    }
  }

  openDetailModal(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for detail modal');
        return;
      }
    this.selectedPokemonForDetail = pokemon;
    this.showDetailModal = true;
    } catch (error) {
      console.error('Error opening detail modal:', error, pokemon);
    }
  }

  openBattleModal(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for battle modal');
        return;
      }
    this.selectedPokemonForBattle = pokemon;
    this.showBattleModal = true;
    } catch (error) {
      console.error('Error opening battle modal:', error, pokemon);
    }
  }

  openComparisonModal(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for comparison modal');
        return;
      }
    this.selectedPokemonForComparison = pokemon;
    this.showComparisonModal = true;
    } catch (error) {
      console.error('Error opening comparison modal:', error, pokemon);
    }
  }

  openBattleWithPokemon(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for battle with Pokemon');
        return;
      }
    this.showDetailModal = false;
    this.selectedPokemonForBattle = pokemon;
    this.showBattleModal = true;
    } catch (error) {
      console.error('Error opening battle with Pokemon:', error, pokemon);
    }
  }

  openComparisonWithPokemon(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for comparison with Pokemon');
        return;
      }
    this.showDetailModal = false;
    this.selectedPokemonForComparison = pokemon;
    this.showComparisonModal = true;
    } catch (error) {
      console.error('Error opening comparison with Pokemon:', error, pokemon);
    }
  }

  openBattleWithTwoPokemon(pokemonData: {pokemon1: Pokemon, pokemon2: Pokemon}): void {
    try {
      if (!pokemonData || !pokemonData.pokemon1 || !pokemonData.pokemon2) {
        console.warn('Invalid Pokemon data for battle with two Pokemon');
        return;
      }
    this.showComparisonModal = false;
    // For now, we'll just open the battle modal with the first pokemon
    // In a real implementation, you'd pass both pokemon to the battle modal
    this.selectedPokemonForBattle = pokemonData.pokemon1;
    this.showBattleModal = true;
    } catch (error) {
      console.error('Error opening battle with two Pokemon:', error, pokemonData);
    }
  }

  isPokemonCaptured(pokemon: Pokemon): boolean {
    try {
      if (!pokemon || !pokemon.id) return false;
    return this.pokemonService.isPokemonInPokedex(pokemon.id);
    } catch (error) {
      console.error('Error checking if Pokemon is captured:', error, pokemon);
      return false;
    }
  }

  addPokemonToPokedex(pokemon: Pokemon): void {
    try {
      if (!pokemon || !pokemon.id) {
        console.warn('Invalid Pokemon data for adding to Pokedex');
        return;
      }
      
    this.pokemonService.addPokemonToPokedex(pokemon);
    // Force refresh to update the status
    this.applyFilters();
    } catch (error) {
      console.error('Error adding Pokemon to Pokedex:', error, pokemon);
    }
  }

  getTotalStats(pokemon: Pokemon): number {
    try {
      if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) return 0;
      
      return pokemon.stats.reduce((total, stat) => {
        if (stat && typeof stat.base_stat === 'number') {
          return total + stat.base_stat;
        }
        return total;
      }, 0);
    } catch (error) {
      console.error('Error calculating total stats:', error, pokemon);
      return 0;
    }
  }

  getGenerationInfo(): string {
    if (!this.selectedGeneration) return '';
    
    const gen = parseInt(this.selectedGeneration);
    const pokemonCount = this.filteredPokemon.length;
    
    const generationNames = {
      1: 'Kanto',
      2: 'Johto', 
      3: 'Hoenn',
      4: 'Sinnoh',
      5: 'Unova',
      6: 'Kalos',
      7: 'Alola',
      8: 'Galar',
      9: 'Paldea'
    };
    
    return `${generationNames[gen as keyof typeof generationNames]} - ${pokemonCount} Pokémon`;
  }

  getGenerationRange(gen: number): string {
    const ranges = {
      1: '1-151',      // Kanto (Red/Blue/Yellow)
      2: '152-251',    // Johto (Gold/Silver/Crystal) 
      3: '252-386',    // Hoenn (Ruby/Sapphire/Emerald)
      4: '387-493',    // Sinnoh (Diamond/Pearl/Platinum)
      5: '494-649',    // Unova (Black/White/Black 2/White 2)
      6: '650-721',    // Kalos (X/Y)
      7: '722-809',    // Alola (Sun/Moon/Ultra Sun/Ultra Moon)
      8: '810-905',    // Galar (Sword/Shield)
      9: '906-1025'    // Paldea (Scarlet/Violet)
    };
    
    return ranges[gen as keyof typeof ranges] || '';
  }

  getSelectedGenerationNumber(): number {
    try {
      if (!this.selectedGeneration) return 0;
      const gen = parseInt(this.selectedGeneration);
      return isNaN(gen) ? 0 : gen;
    } catch (error) {
      console.error('Error getting selected generation number:', error);
      return 0;
    }
  }







  getGenerationStats(): any {
    if (!this.selectedGeneration) return null;
    
    const gen = parseInt(this.selectedGeneration);
    const currentPokemonList = this.showMyPokemonOnly ? this.userPokemon : this.allPokemon;
    
    if (!currentPokemonList || currentPokemonList.length === 0) return null;
    
    const generationPokemon = currentPokemonList.filter(pokemon => {
      const pokemonId = pokemon.id;
      switch (gen) {
        case 1: return pokemonId >= 1 && pokemonId <= 151;
        case 2: return pokemonId >= 152 && pokemonId <= 251;
        case 3: return pokemonId >= 252 && pokemonId <= 386;
        case 4: return pokemonId >= 387 && pokemonId <= 493;
        case 5: return pokemonId >= 494 && pokemonId <= 649;
        case 6: return pokemonId >= 650 && pokemonId <= 721;
        case 7: return pokemonId >= 722 && pokemonId <= 809;
        case 8: return pokemonId >= 810 && pokemonId <= 905;
        case 9: return pokemonId >= 906 && pokemonId <= 1025;
        default: return false;
      }
    });
    
    if (generationPokemon.length === 0) return null;
    
    try {
      const totalStats = generationPokemon.reduce((sum, pokemon) => sum + this.getTotalStats(pokemon), 0);
      const avgStats = Math.round(totalStats / generationPokemon.length);
      
      const strongest = generationPokemon.reduce((max, pokemon) => {
        const currentStats = this.getTotalStats(pokemon);
        const maxStats = this.getTotalStats(max);
        return currentStats > maxStats ? pokemon : max;
      }, generationPokemon[0]);
      
      return {
        total: generationPokemon.length,
        averageStats: avgStats,
        strongest: strongest,
        types: this.extractTypesFromPokemonList(generationPokemon)
      };
    } catch (error) {
      console.error('Error calculating generation stats:', error);
      return null;
    }
  }

  private extractTypesFromPokemonList(pokemonList: Pokemon[]): string[] {
    try {
      if (!pokemonList || pokemonList.length === 0) return [];
      
      const typesSet = new Set<string>();
      pokemonList.forEach(pokemon => {
        if (pokemon && pokemon.types && Array.isArray(pokemon.types)) {
          pokemon.types.forEach(typeInfo => {
            if (typeInfo && typeInfo.type && typeInfo.type.name) {
              typesSet.add(typeInfo.type.name);
            }
          });
        }
      });
      return Array.from(typesSet).sort();
    } catch (error) {
      console.error('Error extracting types from Pokemon list:', error);
      return [];
    }
  }

  getGenerationDetails(): any {
    try {
      if (!this.selectedGeneration) return null;
      
      const generations = [
        { id: 1, name: 'Kanto', region: 'Kanto', games: 'Red, Blue, Yellow', years: '1996-1999' },
        { id: 2, name: 'Johto', region: 'Johto', games: 'Gold, Silver, Crystal', years: '1999-2002' },
        { id: 3, name: 'Hoenn', region: 'Hoenn', games: 'Ruby, Sapphire, Emerald', years: '2002-2006' },
        { id: 4, name: 'Sinnoh', region: 'Sinnoh', games: 'Diamond, Pearl, Platinum', years: '2006-2010' },
        { id: 5, name: 'Unova', region: 'Unova', games: 'Black, White, Black 2, White 2', years: '2010-2013' },
        { id: 6, name: 'Kalos', region: 'Kalos', games: 'X, Y', years: '2013-2016' },
        { id: 7, name: 'Alola', region: 'Alola', games: 'Sun, Moon, Ultra Sun, Ultra Moon', years: '2016-2019' },
        { id: 8, name: 'Galar', region: 'Galar', games: 'Sword, Shield', years: '2019-2022' },
        { id: 9, name: 'Paldea', region: 'Paldea', games: 'Scarlet, Violet', years: '2022-Present' }
      ];
      
      const genId = parseInt(this.selectedGeneration);
      if (isNaN(genId)) return null;
      
      return generations.find(gen => gen.id === genId) || null;
    } catch (error) {
      console.error('Error getting generation details:', error);
      return null;
    }
  }

  getGenerationName(gen: number): string {
    try {
      if (isNaN(gen) || gen < 1 || gen > 9) return `Generación ${gen}`;
      
      const generationNames: { [key: number]: string } = {
        1: 'Primera Generación',
        2: 'Segunda Generación',
        3: 'Tercera Generación',
        4: 'Cuarta Generación',
        5: 'Quinta Generación',
        6: 'Sexta Generación',
        7: 'Séptima Generación',
        8: 'Octava Generación',
        9: 'Novena Generación'
      };
      
      return generationNames[gen] || `Generación ${gen}`;
    } catch (error) {
      console.error('Error getting generation name:', error);
      return `Generación ${gen}`;
    }
  }

  getGenerationTotal(gen: number): number {
    try {
      if (isNaN(gen) || gen < 1 || gen > 9) return 0;
      
      const totals: { [key: number]: number } = {
        1: 151,  // Kanto
        2: 100,  // Johto (152-251)
        3: 135,  // Hoenn (252-386)
        4: 107,  // Sinnoh (387-493)
        5: 156,  // Unova (494-649)
        6: 72,   // Kalos (650-721)
        7: 88,   // Alola (722-809)
        8: 96,   // Galar (810-905)
        9: 120   // Paldea (906-1025)
      };
      
      return totals[gen] || 0;
    } catch (error) {
      console.error('Error getting generation total:', error);
      return 0;
    }
  }



  loadPokemonByGeneration(generation: number): void {
    try {
      if (this.showMyPokemonOnly) return;
      
      if (isNaN(generation) || generation < 1 || generation > 9) {
        console.warn(`Invalid generation: ${generation}`);
        return;
      }
      
      this.loading = true;
      const range = this.getGenerationRange(generation);
      
      if (!range) {
        console.warn(`Could not get range for generation: ${generation}`);
        this.loading = false;
        return;
      }
      
      const [start, end] = range.split('-').map(Number);
      
      if (isNaN(start) || isNaN(end)) {
        console.warn(`Invalid range for generation ${generation}: ${range}`);
        this.loading = false;
        return;
      }
      
      console.log(`Loading Pokemon for generation ${generation} (IDs ${start}-${end})`);
      
      // El servicio getAllPokemon solo devuelve los primeros 1000
      if (generation >= 8) {
        this.pokemonService.getAllPokemon().subscribe({
          next: (pokemonList) => {
            try {
              this.allPokemon = pokemonList.filter(pokemon => {
                const pokemonId = pokemon.id;
                return pokemonId >= start && pokemonId <= end;
              });
              
              console.log(`Found ${this.allPokemon.length} Pokemon for generation ${generation}`);
              
              this.extractAllPokemonTypes();
              this.applyFilters();
              this.loading = false;
            } catch (filterError) {
              console.error('Error filtering Pokemon by generation:', filterError);
              this.loading = false;
              this.loadAllPokemon();
            }
          },
          error: (error) => {
            console.error(`Error loading Pokemon from generation ${generation}:`, error);
            this.loading = false;
            this.loadAllPokemon();
          }
        });
      } else {
        this.pokemonService.getTop100StrongestPokemon().subscribe({
          next: (pokemonList) => {
            try {
              this.allPokemon = pokemonList.filter(pokemon => {
                const pokemonId = pokemon.id;
                return pokemonId >= start && pokemonId <= end;
              });
              
              console.log(`Found ${this.allPokemon.length} Pokemon for generation ${generation}`);
              
              this.extractAllPokemonTypes();
              this.applyFilters();
              this.loading = false;
            } catch (filterError) {
              console.error('Error filtering Pokemon by generation:', filterError);
              this.loading = false;
              this.loadAllPokemon();
            }
          },
          error: (error) => {
            console.error(`Error loading Pokemon from generation ${generation}:`, error);
            this.loading = false;
            this.loadAllPokemon();
          }
        });
      }
    } catch (error) {
      console.error('Error in loadPokemonByGeneration:', error);
      this.loading = false;
    }
  }
}