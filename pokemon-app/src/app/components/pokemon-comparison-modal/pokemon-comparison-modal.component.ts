import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-pokemon-comparison-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="modal" (click)="close.emit()">
      <div class="modal-content comparison-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2><i class="fas fa-balance-scale"></i> {{ 'pokemonComparison' | translate }}</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="comparison-content">
          <!-- Pokemon Selection -->
          <div class="pokemon-selectors" *ngIf="!pokemon1 || !pokemon2">
            <div class="selector-section">
              <h3>{{ 'selectFirstPokemon' | translate }}</h3>
              <select [(ngModel)]="selectedPokemon1Id" (change)="onPokemonSelect(1, $event)">
                <option value="">{{ 'choosePokemon' | translate }}</option>
                <option *ngFor="let pokemon of userPokedex" [value]="pokemon.id">
                  {{ pokemon.name | titlecase }}
                </option>
              </select>
              <div class="preview-card" *ngIf="pokemon1">
                <img [src]="getPokemonImage(pokemon1)" [alt]="pokemon1.name">
                <h4>{{ pokemon1.name | titlecase }}</h4>
              </div>
            </div>

            <div class="vs-divider">
              <span class="vs-text">VS</span>
            </div>

            <div class="selector-section">
              <h3>{{ 'selectSecondPokemon' | translate }}</h3>
              <select [(ngModel)]="selectedPokemon2Id" (change)="onPokemonSelect(2, $event)">
                <option value="">{{ 'choosePokemon' | translate }}</option>
                <option *ngFor="let pokemon of userPokedex" [value]="pokemon.id">
                  {{ pokemon.name | titlecase }}
                </option>
              </select>
              <div class="preview-card" *ngIf="pokemon2">
                <img [src]="getPokemonImage(pokemon2)" [alt]="pokemon2.name">
                <h4>{{ pokemon2.name | titlecase }}</h4>
              </div>
            </div>
          </div>

          <!-- Detailed Comparison -->
          <div class="detailed-comparison" *ngIf="pokemon1 && pokemon2">
            <!-- Basic Info Comparison -->
            <div class="comparison-section">
              <h3>{{ 'basicInfo' | translate }}</h3>
              <div class="comparison-grid">
                <div class="comparison-row header">
                  <div class="pokemon-info">
                    <img [src]="getPokemonImage(pokemon1)" [alt]="pokemon1.name">
                    <h4>{{ pokemon1.name | titlecase }}</h4>
                    <p>#{{ pokemon1.id.toString().padStart(3, '0') }}</p>
                  </div>
                  <div class="category">{{ 'attribute' | translate }}</div>
                  <div class="pokemon-info">
                    <img [src]="getPokemonImage(pokemon2)" [alt]="pokemon2.name">
                    <h4>{{ pokemon2.name | titlecase }}</h4>
                    <p>#{{ pokemon2.id.toString().padStart(3, '0') }}</p>
                  </div>
                </div>

                <div class="comparison-row">
                  <div class="value">{{ (pokemon1.height || 0) / 10 }} m</div>
                  <div class="category">{{ 'height' | translate }}</div>
                  <div class="value">{{ (pokemon2.height || 0) / 10 }} m</div>
                </div>

                <div class="comparison-row">
                  <div class="value">{{ (pokemon1.weight || 0) / 10 }} kg</div>
                  <div class="category">{{ 'weight' | translate }}</div>
                  <div class="value">{{ (pokemon2.weight || 0) / 10 }} kg</div>
                </div>

                <div class="comparison-row">
                  <div class="value">{{ pokemon1.base_experience || 0 }} XP</div>
                  <div class="category">{{ 'baseExperience' | translate }}</div>
                  <div class="value">{{ pokemon2.base_experience || 0 }} XP</div>
                </div>
              </div>
            </div>

            <!-- Types Comparison -->
            <div class="comparison-section">
              <h3>{{ 'types' | translate }}</h3>
              <div class="types-comparison">
                <div class="pokemon-types">
                  <div class="types-list">
                    <span *ngFor="let type of pokemon1.types" 
                          class="type-badge" 
                          [class]="'type-' + type.type.name">
                      {{ type.type.name | titlecase }}
                    </span>
                  </div>
                </div>
                <div class="types-vs">VS</div>
                <div class="pokemon-types">
                  <div class="types-list">
                    <span *ngFor="let type of pokemon2.types" 
                          class="type-badge" 
                          [class]="'type-' + type.type.name">
                      {{ type.type.name | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Comparison -->
            <div class="comparison-section">
              <h3>{{ 'statsComparison' | translate }}</h3>
              <div class="stats-comparison">
                <div class="stats-grid" *ngIf="pokemon1.stats && pokemon2.stats">
                  <div class="stat-row" *ngFor="let stat of pokemon1.stats; let i = index">
                    <div class="stat-bar-container left">
                      <div class="stat-value">{{ stat.base_stat }}</div>
                      <div class="stat-bar">
                        <div class="stat-fill left" 
                             [style.width.%]="getStatBarWidth(stat.base_stat, pokemon2.stats![i].base_stat || 0)"
                             [class.winner]="stat.base_stat > (pokemon2.stats![i].base_stat || 0)">
                        </div>
                      </div>
                    </div>
                    
                    <div class="stat-name">
                      {{ stat.stat.name | titlecase }}
                    </div>
                    
                    <div class="stat-bar-container right">
                      <div class="stat-bar">
                        <div class="stat-fill right" 
                             [style.width.%]="getStatBarWidth(pokemon2.stats![i].base_stat || 0, stat.base_stat)"
                             [class.winner]="(pokemon2.stats![i].base_stat || 0) > stat.base_stat">
                        </div>
                      </div>
                      <div class="stat-value">{{ pokemon2.stats![i].base_stat || 0 }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Battle Prediction -->
            <div class="comparison-section">
              <h3>{{ 'battlePrediction' | translate }}</h3>
              <div class="battle-prediction">
                <div class="prediction-result">
                  <div class="predicted-winner" [class.pokemon1-wins]="getBattlePrediction() === 'pokemon1'" 
                                               [class.pokemon2-wins]="getBattlePrediction() === 'pokemon2'"
                                               [class.tie]="getBattlePrediction() === 'tie'">
                    <i class="fas fa-trophy"></i>
                    <h4>{{ getPredictionText() }}</h4>
                    <p>{{ getPredictionDetails() }}</p>
                  </div>
                </div>
                
                <div class="prediction-breakdown">
                  <div class="breakdown-item">
                    <span class="label">{{ 'totalPower' | translate }}:</span>
                    <span class="pokemon1-value">{{ getTotalPower(pokemon1) }}</span>
                    <span class="vs">vs</span>
                    <span class="pokemon2-value">{{ getTotalPower(pokemon2) }}</span>
                  </div>
                  
                  <div class="breakdown-item">
                    <span class="label">{{ 'offensiveRating' | translate }}:</span>
                    <span class="pokemon1-value">{{ getOffensiveRating(pokemon1) }}%</span>
                    <span class="vs">vs</span>
                    <span class="pokemon2-value">{{ getOffensiveRating(pokemon2) }}%</span>
                  </div>
                  
                  <div class="breakdown-item">
                    <span class="label">{{ 'defensiveRating' | translate }}:</span>
                    <span class="pokemon1-value">{{ getDefensiveRating(pokemon1) }}%</span>
                    <span class="vs">vs</span>
                    <span class="pokemon2-value">{{ getDefensiveRating(pokemon2) }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="comparison-actions">
              <button class="btn btn-primary" (click)="simulateBattle()">
                <i class="fas fa-play"></i> {{ 'simulateBattle' | translate }}
              </button>
              <button class="btn btn-secondary" (click)="resetComparison()">
                <i class="fas fa-redo"></i> {{ 'compareOthers' | translate }}
              </button>
              <button class="btn btn-info" (click)="exportComparison()">
                <i class="fas fa-download"></i> {{ 'exportResults' | translate }}
              </button>
            </div>
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
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      overflow-y: auto;
      padding: 20px 0;
    }

    .comparison-modal {
      max-width: 1200px;
      width: 95%;
      max-height: 95vh;
      overflow-y: auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 20px 20px 0 0;
      border-bottom: 3px solid #667eea;
    }

    .comparison-content {
      padding: 30px;
      color: white;
    }

    .pokemon-selectors {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 30px;
      align-items: center;
      margin-bottom: 30px;
    }

    .selector-section {
      text-align: center;
    }

    .selector-section h3 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    select {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      margin-bottom: 20px;
    }

    select option {
      background: #333;
      color: white;
    }

    .preview-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }

    .preview-card img {
      width: 100px;
      height: 100px;
      margin-bottom: 10px;
    }

    .vs-divider {
      text-align: center;
    }

    .vs-text {
      font-size: 3rem;
      font-weight: bold;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .detailed-comparison {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .comparison-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 25px;
      backdrop-filter: blur(10px);
    }

    .comparison-section h3 {
      margin-bottom: 20px;
      font-size: 1.4rem;
      text-align: center;
      color: #feca57;
    }

    .comparison-grid {
      display: grid;
      gap: 15px;
    }

    .comparison-row {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .comparison-row.header {
      background: rgba(255, 255, 255, 0.1);
      font-weight: bold;
    }

    .pokemon-info {
      text-align: center;
    }

    .pokemon-info img {
      width: 60px;
      height: 60px;
      margin-bottom: 5px;
    }

    .pokemon-info h4 {
      margin: 5px 0;
      font-size: 1.1rem;
    }

    .pokemon-info p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .category {
      text-align: center;
      font-weight: bold;
      color: #feca57;
    }

    .value {
      text-align: center;
      font-size: 1.1rem;
      font-weight: bold;
    }

    .types-comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 20px;
      align-items: center;
    }

    .types-list {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .type-badge {
      padding: 8px 15px;
      border-radius: 20px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
    }

    /* Type colors */
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

    .types-vs {
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: #feca57;
    }

    .stats-grid {
      display: grid;
      gap: 10px;
    }

    .stat-row {
      display: grid;
      grid-template-columns: 2fr auto 2fr;
      gap: 15px;
      align-items: center;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .stat-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-bar-container.left {
      justify-content: flex-end;
    }

    .stat-bar-container.right {
      justify-content: flex-start;
    }

    .stat-bar {
      width: 150px;
      height: 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      overflow: hidden;
    }

    .stat-fill {
      height: 100%;
      background: linear-gradient(90deg, #4ecdc4, #feca57);
      border-radius: 6px;
      transition: all 0.5s ease;
    }

    .stat-fill.winner {
      background: linear-gradient(90deg, #ff6b6b, #feca57);
    }

    .stat-fill.left {
      margin-left: auto;
    }

    .stat-name {
      text-align: center;
      font-weight: bold;
      color: #feca57;
      text-transform: capitalize;
    }

    .stat-value {
      font-weight: bold;
      min-width: 30px;
    }

    .battle-prediction {
      text-align: center;
    }

    .predicted-winner {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }

    .predicted-winner.pokemon1-wins {
      background: rgba(78, 205, 196, 0.2);
      border: 2px solid #4ecdc4;
    }

    .predicted-winner.pokemon2-wins {
      background: rgba(255, 107, 107, 0.2);
      border: 2px solid #ff6b6b;
    }

    .predicted-winner.tie {
      background: rgba(254, 202, 87, 0.2);
      border: 2px solid #feca57;
    }

    .predicted-winner i {
      font-size: 3rem;
      color: #feca57;
      margin-bottom: 15px;
    }

    .predicted-winner h4 {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }

    .prediction-breakdown {
      display: grid;
      gap: 10px;
    }

    .breakdown-item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 15px;
      align-items: center;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .label {
      font-weight: bold;
      color: #feca57;
    }

    .pokemon1-value {
      color: #4ecdc4;
      font-weight: bold;
    }

    .pokemon2-value {
      color: #ff6b6b;
      font-weight: bold;
    }

    .vs {
      color: #feca57;
      font-weight: bold;
    }

    .comparison-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 30px;
    }

    .btn {
      padding: 12px 25px;
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

    .btn-secondary {
      background: linear-gradient(45deg, #6b7280, #4b5563);
      color: white;
    }

    .btn-info {
      background: linear-gradient(45deg, #06b6d4, #0891b2);
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .pokemon-selectors {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .vs-divider {
        order: -1;
      }

      .comparison-row {
        grid-template-columns: 1fr;
        gap: 10px;
        text-align: center;
      }

      .types-comparison {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .stat-row {
        grid-template-columns: 1fr;
        gap: 10px;
        text-align: center;
      }

      .stat-bar {
        width: 100px;
      }

      .breakdown-item {
        grid-template-columns: 1fr;
        gap: 5px;
        text-align: center;
      }
    }
  `]
})
export class PokemonComparisonModalComponent implements OnInit {
  @Input() initialPokemon: Pokemon | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() openBattleModal = new EventEmitter<{pokemon1: Pokemon, pokemon2: Pokemon}>();

  userPokedex: Pokemon[] = [];
  pokemon1: Pokemon | null = null;
  pokemon2: Pokemon | null = null;
  selectedPokemon1Id: string = '';
  selectedPokemon2Id: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.userPokedex = this.pokemonService.getUserPokedex();
    
    if (this.initialPokemon) {
      this.pokemon1 = this.initialPokemon;
      this.selectedPokemon1Id = this.initialPokemon.id.toString();
    }
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default || 
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }

  onPokemonSelect(slot: number, event: any): void {
    const pokemonId = parseInt(event.target.value);
    const pokemon = this.userPokedex.find(p => p.id === pokemonId);
    
    if (slot === 1) {
      this.pokemon1 = pokemon || null;
    } else {
      this.pokemon2 = pokemon || null;
    }
  }

  getTotalPower(pokemon: Pokemon): number {
    if (!pokemon.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  }

  getOffensiveRating(pokemon: Pokemon): number {
    if (!pokemon.stats) return 0;
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    const spAttack = pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
    const speed = pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;
    
    return Math.round(((attack + spAttack + speed) / 450) * 100);
  }

  getDefensiveRating(pokemon: Pokemon): number {
    if (!pokemon.stats) return 0;
    const defense = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
    const spDefense = pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
    const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
    
    return Math.round(((defense + spDefense + hp) / 450) * 100);
  }

  getBattlePrediction(): 'pokemon1' | 'pokemon2' | 'tie' {
    if (!this.pokemon1 || !this.pokemon2) return 'tie';
    
    const power1 = this.getTotalPower(this.pokemon1);
    const power2 = this.getTotalPower(this.pokemon2);
    
    const difference = Math.abs(power1 - power2);
    
    if (difference < 20) return 'tie';
    return power1 > power2 ? 'pokemon1' : 'pokemon2';
  }

  getPredictionText(): string {
    const prediction = this.getBattlePrediction();
    
    switch (prediction) {
      case 'pokemon1':
        return `${this.pokemon1?.name} tiene ventaja`;
      case 'pokemon2':
        return `${this.pokemon2?.name} tiene ventaja`;
      case 'tie':
        return 'Batalla muy equilibrada';
      default:
        return 'Empate';
    }
  }

  getPredictionDetails(): string {
    if (!this.pokemon1 || !this.pokemon2) return '';
    
    const power1 = this.getTotalPower(this.pokemon1);
    const power2 = this.getTotalPower(this.pokemon2);
    const difference = Math.abs(power1 - power2);
    
    if (difference < 20) {
      return 'Los estadísticas son muy similares. La victoria dependerá de la estrategia y la suerte.';
    }
    
    const stronger = power1 > power2 ? this.pokemon1.name : this.pokemon2.name;
    return `${stronger} tiene una ventaja estadística significativa con ${difference} puntos de diferencia.`;
  }

  simulateBattle(): void {
    if (this.pokemon1 && this.pokemon2) {
      this.openBattleModal.emit({
        pokemon1: this.pokemon1,
        pokemon2: this.pokemon2
      });
    }
  }

  resetComparison(): void {
    this.pokemon1 = null;
    this.pokemon2 = null;
    this.selectedPokemon1Id = '';
    this.selectedPokemon2Id = '';
  }

  getStatBarWidth(currentStat: number, compareStat: number): number {
    const maxStat = Math.max(currentStat, compareStat);
    return maxStat > 0 ? (currentStat / maxStat) * 100 : 0;
  }

  exportComparison(): void {
    if (!this.pokemon1 || !this.pokemon2) return;
    
    const comparisonData = {
      pokemon1: {
        name: this.pokemon1.name,
        id: this.pokemon1.id,
        totalPower: this.getTotalPower(this.pokemon1),
        offensiveRating: this.getOffensiveRating(this.pokemon1),
        defensiveRating: this.getDefensiveRating(this.pokemon1),
        stats: this.pokemon1.stats
      },
      pokemon2: {
        name: this.pokemon2.name,
        id: this.pokemon2.id,
        totalPower: this.getTotalPower(this.pokemon2),
        offensiveRating: this.getOffensiveRating(this.pokemon2),
        defensiveRating: this.getDefensiveRating(this.pokemon2),
        stats: this.pokemon2.stats
      },
      prediction: this.getBattlePrediction(),
      predictionText: this.getPredictionText(),
      predictionDetails: this.getPredictionDetails(),
      comparisonDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pokemon-comparison-${this.pokemon1.name}-vs-${this.pokemon2.name}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}