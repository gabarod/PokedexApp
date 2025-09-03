import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-add-pokemon-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h2>{{ mode === 'team' ? 'Agregar Pokémon al Equipo' : 'Agregar Pokémon' }}</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="filters">
          <div class="filters-row">
            <div class="form-group">
              <label>Buscar</label>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="applyFilters()"
                placeholder="Buscar por nombre"
              >
            </div>
            
            <div class="form-group">
              <label>Tipo</label>
              <select [(ngModel)]="selectedType" (change)="applyFilters()">
                <option value="">Todos</option>
                <option *ngFor="let type of pokemonTypes" [value]="type">{{ type | titlecase }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Región</label>
              <select [(ngModel)]="filterByRegion" (change)="applyFilters()">
                <option value="">Todas las regiones</option>
                <option *ngFor="let region of regions" [value]="region">{{ region | titlecase }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Generación</label>
              <select [(ngModel)]="filterByGeneration" (change)="applyFilters()">
                <option value="">Todas las generaciones</option>
                <option *ngFor="let gen of generations" [value]="gen">Gen {{ gen }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Ordenar por</label>
              <select [(ngModel)]="sortBy" (change)="applySorting()">
                <option value="name">Nombre</option>
                <option value="attack">Ataque</option>
                <option value="defense">Defensa</option>
                <option value="speed">Velocidad</option>
              </select>
            </div>

            <div class="form-group">
              <button class="btn btn-secondary" (click)="clearFilters()">Limpiar</button>
            </div>
          </div>
        </div>

        <div class="table-container" *ngIf="!loading">
          <div class="bulk-actions">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [checked]="isAllSelected()" 
                (change)="toggleSelectAll()"
              >
              Seleccionar todo
            </label>
            <button 
              class="btn btn-primary" 
              [disabled]="selectedPokemon.length === 0"
              (click)="addSelectedPokemon()"
            >
              Agregar Seleccionados ({{ selectedPokemon.length }})
            </button>
          </div>

          <div class="pokemon-table">
            <div class="table-header">
              <div class="col-select">Seleccionar</div>
              <div class="col-image">Imagen</div>
              <div class="col-name">Nombre</div>
              <div class="col-stat">ATK</div>
              <div class="col-stat">DEF</div>
              <div class="col-stat">SPD</div>
              <div class="col-status">Estado</div>
            </div>

            <div class="table-row" *ngFor="let pokemon of displayedPokemon">
              <div class="col-select">
                <input 
                  type="checkbox" 
                  [checked]="selectedPokemon.includes(pokemon.id)"
                  [disabled]="getIsPokemonUnavailable(pokemon.id)"
                  (change)="togglePokemonSelection(pokemon.id)"
                >
              </div>
              <div class="col-image">
                <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" />
              </div>
              <div class="col-name">{{ pokemon.name | titlecase }}</div>
              <div class="col-stat">{{ getPokemonStat(pokemon, 'attack') }}</div>
              <div class="col-stat">{{ getPokemonStat(pokemon, 'defense') }}</div>
              <div class="col-stat">{{ getPokemonStat(pokemon, 'speed') }}</div>
              <div class="col-status">
                <span 
                  class="status-badge"
                  [class.already-added]="getIsPokemonUnavailable(pokemon.id)"
                  [class.in-team]="mode === 'team' && getIsPokemonInCurrentTeam(pokemon.id)"
                  [class.not-captured]="mode === 'team' && !pokemonService.isPokemonInPokedex(pokemon.id)"
                >
                  {{ getPokemonStatus(pokemon.id) }}
                </span>
                <button 
                  *ngIf="mode === 'team' && getIsPokemonInCurrentTeam(pokemon.id)"
                  class="btn-remove-from-team"
                  (click)="removePokemonFromTeam(pokemon.id)"
                  title="Quitar del equipo"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="displayedPokemon.length === 0">
            <i class="fas fa-search"></i>
            <p>No se encontraron Pokémon con estos criterios</p>
          </div>
        </div>

        <div class="loading" *ngIf="loading">
          <div class="spinner"></div>
          <p>Cargando Pokémon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .large-modal {
      max-width: 95vw;
      width: 1000px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .table-container {
      flex: 1;
      overflow-y: auto;
      margin-top: 20px;
    }

    .bulk-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 16px;

      .checkbox-label {
        display: flex;
        align-items: center;
        font-weight: 500;
        
        input {
          margin-right: 8px;
        }
      }
    }

    .pokemon-table {
      .table-header, .table-row {
        display: grid;
        grid-template-columns: 80px 80px 1fr 60px 60px 60px 120px;
        gap: 12px;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .table-header {
        font-weight: 600;
        color: #374151;
        background: #f9fafb;
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .table-row {
        &:hover {
          background: #f9fafb;
        }
      }

      .col-image img {
        width: 50px;
        height: 50px;
        object-fit: contain;
      }

      .col-name {
        font-weight: 500;
        color: #1f2937;
      }

      .col-stat {
        font-weight: 600;
        color: #ef4444;
        text-align: center;
      }

      .col-select {
        text-align: center;
      }

      .col-status {
        display: flex;
        align-items: center;
        gap: 8px;

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          background: #10b981;
          color: white;

          &.already-added {
            background: #6b7280;
          }

          &.in-team {
            background: #10b981;
            color: white;
          }

          &.not-captured {
            background: #ef4444;
            color: white;
          }
        }

        .btn-remove-from-team {
          background: #ef4444;
          color: white;
          border: none;
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: #dc2626;
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
      
      i {
        font-size: 2rem;
        margin-bottom: 16px;
      }
    }

    @media (max-width: 768px) {
      .pokemon-table {
        .table-header, .table-row {
          grid-template-columns: 60px 60px 1fr 50px 50px 50px 80px;
          gap: 8px;
        }

        .col-image img {
          width: 40px;
          height: 40px;
        }
      }
    }
  `]
})
export class AddPokemonModalComponent implements OnInit {
  @Input() mode: 'pokedex' | 'team' = 'pokedex';
  @Input() teamId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() pokemonAdded = new EventEmitter<void>();

  allPokemon: Pokemon[] = [];
  displayedPokemon: Pokemon[] = [];
  selectedPokemon: number[] = [];
  pokemonTypes: string[] = [];
  
  searchTerm = '';
  selectedType = '';
  sortBy = 'name';
  filterByRegion = '';
  filterByGeneration = '';
  
  regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar'];
  generations = ['1', '2', '3', '4', '5', '6', '7', '8'];
  loading = true;

  constructor(
    public pokemonService: PokemonService,
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  private loadPokemon(): void {
    if (this.mode === 'team') {
      this.allPokemon = this.pokemonService.getUserPokedex();
      this.displayedPokemon = [...this.allPokemon];
      this.extractTypes();
      this.applySorting();
      this.loading = false;
    } else {
      this.pokemonService.getTop100StrongestPokemon().subscribe({
        next: (pokemon) => {
          console.log('Loaded Pokemon:', pokemon.length);
          this.allPokemon = pokemon;
          this.displayedPokemon = [...pokemon];
          this.extractTypes();
          this.applySorting();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading Pokemon:', error);
          this.loading = false;
          // Fallback: Load a smaller set of Pokemon
          this.loadFallbackPokemon();
        }
      });
    }
  }

  private loadFallbackPokemon(): void {
    // Load first 20 Pokemon as fallback
    const fallbackRequests = Array.from({ length: 20 }, (_, i) => 
      this.pokemonService.getPokemonDetails(i + 1)
    );
    
    forkJoin(fallbackRequests).subscribe({
      next: (pokemon) => {
        console.log('Loaded fallback Pokemon:', pokemon.length);
        this.allPokemon = pokemon;
        this.displayedPokemon = [...pokemon];
        this.extractTypes();
        this.applySorting();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fallback Pokemon:', error);
        this.loading = false;
      }
    });
  }

  private extractTypes(): void {
    const typesSet = new Set<string>();
    this.allPokemon.forEach(pokemon => {
      if (pokemon.types) {
        pokemon.types.forEach(typeInfo => {
          typesSet.add(typeInfo.type.name);
        });
      }
    });
    this.pokemonTypes = Array.from(typesSet).sort();
  }

  applyFilters(): void {
    this.displayedPokemon = this.allPokemon.filter(pokemon => {
      const matchesSearch = !this.searchTerm || 
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedType || 
        pokemon.types?.some(type => type.type.name === this.selectedType);
      
      const matchesRegion = !this.filterByRegion || 
        this.isPokemonInRegion(pokemon.id, this.filterByRegion);
      
      const matchesGeneration = !this.filterByGeneration || 
        this.isPokemonInGeneration(pokemon.id, parseInt(this.filterByGeneration));
      
      return matchesSearch && matchesType && matchesRegion && matchesGeneration;
    });
    
    this.applySorting();
  }

  private isPokemonInRegion(pokemonId: number, region: string): boolean {
    const regionRanges = this.getRegionRanges();
    const range = regionRanges[region];
    return range ? pokemonId >= range.start && pokemonId <= range.end : false;
  }

  private isPokemonInGeneration(pokemonId: number, generation: number): boolean {
    const genRanges = this.getGenerationRanges();
    const range = genRanges[generation];
    return range ? pokemonId >= range.start && pokemonId <= range.end : false;
  }

  private getRegionRanges(): { [key: string]: { start: number; end: number } } {
    return {
      'kanto': { start: 1, end: 151 },
      'johto': { start: 152, end: 251 },
      'hoenn': { start: 252, end: 386 },
      'sinnoh': { start: 387, end: 493 },
      'unova': { start: 494, end: 649 },
      'kalos': { start: 650, end: 721 },
      'alola': { start: 722, end: 809 },
      'galar': { start: 810, end: 898 }
    };
  }

  private getGenerationRanges(): { [key: number]: { start: number; end: number } } {
    return {
      1: { start: 1, end: 151 },
      2: { start: 152, end: 251 },
      3: { start: 252, end: 386 },
      4: { start: 387, end: 493 },
      5: { start: 494, end: 649 },
      6: { start: 650, end: 721 },
      7: { start: 722, end: 809 },
      8: { start: 810, end: 898 }
    };
  }

  applySorting(): void {
    this.displayedPokemon.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attack':
          return this.getPokemonStat(b, 'attack') - this.getPokemonStat(a, 'attack');
        case 'defense':
          return this.getPokemonStat(b, 'defense') - this.getPokemonStat(a, 'defense');
        case 'speed':
          return this.getPokemonStat(b, 'speed') - this.getPokemonStat(a, 'speed');
        default:
          return 0;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.filterByRegion = '';
    this.filterByGeneration = '';
    this.sortBy = 'name';
    this.applyFilters();
  }

  togglePokemonSelection(pokemonId: number): void {
    // Don't allow selection if Pokemon is unavailable
    if (this.getIsPokemonUnavailable(pokemonId)) {
      return;
    }
    
    const index = this.selectedPokemon.indexOf(pokemonId);
    if (index > -1) {
      this.selectedPokemon.splice(index, 1);
    } else {
      this.selectedPokemon.push(pokemonId);
    }
  }

  toggleSelectAll(): void {
    const availablePokemon = this.displayedPokemon
      .filter(p => !this.getIsPokemonUnavailable(p.id))
      .map(p => p.id);

    if (this.isAllSelected()) {
      this.selectedPokemon = this.selectedPokemon
        .filter(id => !availablePokemon.includes(id));
    } else {
      availablePokemon.forEach(id => {
        if (!this.selectedPokemon.includes(id)) {
          this.selectedPokemon.push(id);
        }
      });
    }
  }

  isAllSelected(): boolean {
    const availablePokemon = this.displayedPokemon
      .filter(p => !this.getIsPokemonUnavailable(p.id));
    
    return availablePokemon.length > 0 && 
           availablePokemon.every(p => this.selectedPokemon.includes(p.id));
  }

  addSelectedPokemon(): void {
    if (this.selectedPokemon.length > 0) {
      console.log('Adding Pokemon:', this.selectedPokemon);
      
      if (this.mode === 'team' && this.teamId) {
        // Add Pokemon to specific team
        this.selectedPokemon.forEach(pokemonId => {
          const pokemon = this.allPokemon.find(p => p.id === pokemonId);
          if (pokemon) {
            this.pokemonService.addPokemonToTeam(this.teamId, pokemon);
          }
        });
        console.log('Pokemon added to team successfully');
        this.selectedPokemon = [];
        this.pokemonAdded.emit();
        this.close.emit();
      } else {
        this.pokemonService.addMultiplePokemonToPokedex(this.selectedPokemon).subscribe({
          next: () => {
            console.log('Pokemon added successfully');
            this.selectedPokemon = [];
            this.pokemonAdded.emit();
            this.close.emit();
          },
          error: (error) => {
            console.error('Error adding Pokemon:', error);
          }
        });
      }
    }
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  getPokemonStat(pokemon: Pokemon, statName: string): number {
    return pokemon.stats?.find(stat => stat.stat.name === statName)?.base_stat || 0;
  }

  getIsPokemonUnavailable(pokemonId: number): boolean {
    if (this.mode === 'team' && this.teamId) {
      const team = this.pokemonService.getTeamById(this.teamId);
      const isInCurrentTeam = team && team.pokemons.some(p => p.id === pokemonId);
      const isInPokedex = this.pokemonService.isPokemonInPokedex(pokemonId);
      
      return isInCurrentTeam || !isInPokedex;
    } else {
      return this.pokemonService.isPokemonInPokedex(pokemonId);
    }
  }

  getIsPokemonInCurrentTeam(pokemonId: number): boolean {
    if (this.mode === 'team' && this.teamId) {
      const team = this.pokemonService.getTeamById(this.teamId);
      return team ? team.pokemons.some(p => p.id === pokemonId) : false;
    }
    return false;
  }

  getPokemonStatus(pokemonId: number): string {
    if (this.mode === 'team') {
      if (!this.pokemonService.isPokemonInPokedex(pokemonId)) {
        return 'No capturado';
      } else if (this.getIsPokemonInCurrentTeam(pokemonId)) {
        return 'En equipo';
      } else {
        return 'Disponible';
      }
    } else {
      return this.pokemonService.isPokemonInPokedex(pokemonId) ? 'Ya agregado' : 'Disponible';
    }
  }

  removePokemonFromTeam(pokemonId: number): void {
    if (this.mode === 'team' && this.teamId) {
      this.notificationService.showConfirmation(
        this.translationService.translate('confirmRemovePokemon') || '¿Estás seguro de que deseas quitar este Pokémon del equipo?',
        () => {
          this.pokemonService.removePokemonFromTeam(this.teamId!, pokemonId);
          // Remove from selected if it was selected
          this.selectedPokemon = this.selectedPokemon.filter(id => id !== pokemonId);
          // Emit event to update parent component
          this.pokemonAdded.emit();
        }
      );
    }
  }
}