import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-pokemon-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="modal" (click)="close.emit()">
      <div class="modal-content pokemon-detail" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ pokemon?.name | titlecase }} Details</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="pokemon-detail-content" *ngIf="pokemon">
          <div class="pokemon-main-info">
            <div class="pokemon-image-section">
              <img [src]="getPokemonImage(pokemon)" [alt]="pokemon.name" class="main-pokemon-image">
              <div class="pokemon-basic-info">
                <h3>{{ pokemon.name | titlecase }}</h3>
                <p class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
                <div class="pokemon-types">
                  <span *ngFor="let type of pokemon.types" 
                        class="type-badge" 
                        [class]="'type-' + type.type.name">
                    {{ type.type.name | titlecase }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pokemon-stats-section">
              <h4>{{ 'stats' | translate }}</h4>
              <div class="stats-grid" *ngIf="pokemon.stats">
                <div class="stat-item" *ngFor="let stat of pokemon.stats">
                  <span class="stat-name">{{ stat.stat.name | titlecase }}</span>
                  <div class="stat-bar">
                    <div class="stat-fill" [style.width.%]="(stat.base_stat / 200) * 100"></div>
                    <span class="stat-value">{{ stat.base_stat }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pokemon-additional-info">
            <div class="info-grid">
              <div class="info-card">
                <h4>{{ 'physicalInfo' | translate }}</h4>
                <div class="info-row">
                  <span>{{ 'height' | translate }}:</span>
                  <span>{{ (pokemon.height || 0) / 10 }} m</span>
                </div>
                <div class="info-row">
                  <span>{{ 'weight' | translate }}:</span>
                  <span>{{ (pokemon.weight || 0) / 10 }} kg</span>
                </div>
                <div class="info-row">
                  <span>{{ 'experience' | translate }}:</span>
                  <span>{{ pokemon.base_experience || 0 }} XP</span>
                </div>
              </div>

              <div class="info-card">
                <h4>{{ 'battleInfo' | translate }}</h4>
                <div class="battle-stats">
                  <div class="battle-stat">
                    <span class="battle-label">{{ 'totalPower' | translate }}:</span>
                    <span class="battle-value">{{ getTotalPower(pokemon) }}</span>
                  </div>
                  <div class="battle-stat">
                    <span class="battle-label">{{ 'effectiveness' | translate }}:</span>
                    <span class="battle-value">{{ getBattleEffectiveness(pokemon) }}%</span>
                  </div>
                  <div class="battle-stat">
                    <span class="battle-label">{{ 'rank' | translate }}:</span>
                    <span class="battle-value">{{ getBattleRank(pokemon) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pokemon-actions">
            <button class="btn btn-primary" 
                    *ngIf="!pokemonService.isPokemonInPokedex(pokemon.id)"
                    (click)="addToPokedex()">
              <i class="fas fa-plus"></i> {{ 'addToPokedex' | translate }}
            </button>
            <button class="btn btn-success" 
                    *ngIf="pokemonService.isPokemonInPokedex(pokemon.id)"
                    disabled>
              <i class="fas fa-check"></i> {{ 'inPokedex' | translate }}
            </button>
            <button class="btn btn-secondary" (click)="openBattleSimulator()">
              <i class="fas fa-sword"></i> {{ 'battleSimulator' | translate }}
            </button>
            <button class="btn btn-info" (click)="openComparison()">
              <i class="fas fa-balance-scale"></i> {{ 'comparePokemon' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .pokemon-detail {
      max-width: 800px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 0;
    }

    .modal-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 20px 20px 0 0;
      border-bottom: 2px solid #eee;
    }

    .pokemon-detail-content {
      padding: 20px;
      color: white;
    }

    .pokemon-main-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .pokemon-image-section {
      text-align: center;
    }

    .main-pokemon-image {
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      padding: 20px;
      margin-bottom: 15px;
      backdrop-filter: blur(10px);
    }

    .pokemon-basic-info h3 {
      font-size: 2rem;
      margin: 10px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .pokemon-id {
      font-size: 1.2rem;
      opacity: 0.8;
      margin-bottom: 15px;
    }

    .pokemon-types {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .type-badge {
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }

    .type-normal { background: #A8A878; }
    .type-fire { background: #F08030; }
    .type-water { background: #6890F0; }
    .type-electric { background: #F8D030; }
    .type-grass { background: #78C850; }
    .type-ice { background: #98D8D8; }
    .type-fighting { background: #C03028; }
    .type-poison { background: #A040A0; }
    .type-ground { background: #E0C068; }
    .type-flying { background: #A890F0; }
    .type-psychic { background: #F85888; }
    .type-bug { background: #A8B820; }
    .type-rock { background: #B8A038; }
    .type-ghost { background: #705898; }
    .type-dragon { background: #7038F8; }
    .type-dark { background: #705848; }
    .type-steel { background: #B8B8D0; }
    .type-fairy { background: #EE99AC; }

    .pokemon-stats-section h4 {
      margin-bottom: 15px;
      font-size: 1.4rem;
    }

    .stats-grid {
      display: grid;
      gap: 10px;
    }

    .stat-item {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      align-items: center;
      gap: 10px;
    }

    .stat-name {
      font-weight: bold;
      text-transform: capitalize;
    }

    .stat-bar {
      position: relative;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      height: 8px;
      overflow: hidden;
    }

    .stat-fill {
      background: linear-gradient(90deg, #4CAF50, #FFC107, #FF5722);
      height: 100%;
      border-radius: 10px;
      transition: width 0.8s ease;
    }

    .stat-value {
      font-weight: bold;
      min-width: 40px;
      text-align: right;
    }

    .pokemon-additional-info {
      margin-bottom: 30px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }

    .info-card h4 {
      margin-bottom: 15px;
      color: #fff;
      font-size: 1.2rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .battle-stats {
      display: grid;
      gap: 10px;
    }

    .battle-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .battle-label {
      font-weight: bold;
    }

    .battle-value {
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 10px;
      border-radius: 10px;
      font-weight: bold;
    }

    .pokemon-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(45deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .btn-success {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
    }

    .btn-secondary {
      background: linear-gradient(45deg, #6b7280, #4b5563);
      color: white;
    }

    .btn-info {
      background: linear-gradient(45deg, #06b6d4, #0891b2);
      color: white;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .pokemon-main-info,
      .info-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .main-pokemon-image {
        width: 150px;
        height: 150px;
      }

      .pokemon-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PokemonDetailModalComponent implements OnInit {
  @Input() pokemon: Pokemon | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() openBattleModal = new EventEmitter<Pokemon>();
  @Output() openComparisonModal = new EventEmitter<Pokemon>();

  constructor(public pokemonService: PokemonService) {}

  ngOnInit(): void {}

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }

  getTotalPower(pokemon: Pokemon): number {
    if (!pokemon.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  }

  getBattleEffectiveness(pokemon: Pokemon): number {
    const totalPower = this.getTotalPower(pokemon);
    // Calculate effectiveness based on total stats (max possible ~600)
    return Math.round((totalPower / 600) * 100);
  }

  getBattleRank(pokemon: Pokemon): string {
    const effectiveness = this.getBattleEffectiveness(pokemon);
    if (effectiveness >= 80) return 'Legendary';
    if (effectiveness >= 65) return 'Elite';
    if (effectiveness >= 50) return 'Strong';
    if (effectiveness >= 35) return 'Average';
    return 'Rookie';
  }

  addToPokedex(): void {
    if (this.pokemon) {
      this.pokemonService.addPokemonToPokedex(this.pokemon);
    }
  }

  openBattleSimulator(): void {
    if (this.pokemon) {
      this.openBattleModal.emit(this.pokemon);
    }
  }

  openComparison(): void {
    if (this.pokemon) {
      this.openComparisonModal.emit(this.pokemon);
    }
  }
}