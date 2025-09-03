import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PokemonAttack, getRandomAttacksForPokemon } from './pokemon-attacks';

interface BattleResult {
  winner: Pokemon;
  loser: Pokemon;
  rounds: BattleRound[];
  totalDamage: number; 
}

interface BattleRound {
  attacker: Pokemon;
  defender: Pokemon;
  damage: number;
  critical: boolean;
  effectiveness: string;
  attack: PokemonAttack;
  attackName: string;
}

@Component({
  selector: 'app-battle-simulator-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="modal" (click)="close.emit()">
      <div class="modal-content battle-simulator" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2><i class="fas fa-sword"></i> {{ 'battleSimulator' | translate }}</h2>
          <div class="header-controls">
            <button class="close-btn" (click)="close.emit()">&times;</button>
          </div>
        </div>

        <div class="battle-content">
          <!-- Pokemon Selection -->
          <div class="pokemon-selection" *ngIf="!battleInProgress && !battleResult">
            <div class="battle-setup">
              <h3>{{ 'selectPokemon' | translate }}</h3>
              
              <div class="fighters-grid">
                <div class="fighter-section">
                  <h4>{{ 'fighter1' | translate }}</h4>
                  <div class="pokemon-card" [class.selected]="selectedPokemon1" *ngIf="selectedPokemon1">
                    <img [src]="getPokemonImage(selectedPokemon1)" [alt]="selectedPokemon1.name">
                    <h5>{{ selectedPokemon1.name | titlecase }}</h5>
                    <p>{{ 'power' | translate }}: {{ getTotalPower(selectedPokemon1) }}</p>
                    <div class="pokemon-attacks" *ngIf="pokemon1Attacks.length > 0">
                      <h6>{{ 'attacks' | translate }}:</h6>
                      <div class="attack-list">
                        <span *ngFor="let attack of pokemon1Attacks" class="attack-badge">
                          {{ attack.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <select [(ngModel)]="selectedPokemon1Id" (change)="onPokemonSelect(1, $event)">
                    <option value="">{{ 'selectPokemon' | translate }}</option>
                    <option *ngFor="let pokemon of userPokedex" [value]="pokemon.id">
                      {{ pokemon.name | titlecase }} ({{ getTotalPower(pokemon) }})
                    </option>
                  </select>
                </div>

                <div class="vs-divider">
                  <span class="vs-text">VS</span>
                </div>

                <div class="fighter-section">
                  <h4>{{ 'fighter2' | translate }}</h4>
                  <div class="pokemon-card" [class.selected]="selectedPokemon2" *ngIf="selectedPokemon2">
                    <img [src]="getPokemonImage(selectedPokemon2)" [alt]="selectedPokemon2.name">
                    <h5>{{ selectedPokemon2.name | titlecase }}</h5>
                    <p>{{ 'power' | translate }}: {{ getTotalPower(selectedPokemon2) }}</p>
                    <div class="pokemon-attacks" *ngIf="pokemon2Attacks.length > 0">
                      <h6>{{ 'attacks' | translate }}:</h6>
                      <div class="attack-list">
                        <span *ngFor="let attack of pokemon2Attacks" class="attack-badge">
                          {{ attack.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <select [(ngModel)]="selectedPokemon2Id" (change)="onPokemonSelect(2, $event)">
                    <option value="">{{ 'selectPokemon' | translate }}</option>
                    <option *ngFor="let pokemon of userPokedex" [value]="pokemon.id">
                      {{ pokemon.name | titlecase }} ({{ getTotalPower(pokemon) }})
                    </option>
                  </select>
                </div>
              </div>

              <button class="btn btn-primary start-battle" 
                      [disabled]="!selectedPokemon1 || !selectedPokemon2 || selectedPokemon1.id === selectedPokemon2.id"
                      (click)="startBattle()">
                <i class="fas fa-play"></i> {{ 'startBattle' | translate }}
              </button>
            </div>
          </div>

          <!-- Battle Animation -->
          <div class="battle-arena" *ngIf="battleInProgress">
            <div class="arena-background">
              <div class="fighter left" [class.attacking]="currentAttacker === selectedPokemon1">
                <img [src]="getPokemonImage(selectedPokemon1!)" [alt]="selectedPokemon1!.name">
                <div class="health-bar">
                  <div class="health-fill" [style.width.%]="(fighter1Health / fighter1MaxHealth) * 100"></div>
                </div>
                <div class="health-text">
                  HP: {{ fighter1Health }}/{{ fighter1MaxHealth }}
                </div>
                <h4>{{ selectedPokemon1!.name | titlecase }}</h4>
              </div>

              <div class="battle-effects">
                <div class="effect-text" *ngIf="currentEffect">{{ currentEffect }}</div>
                <div class="battle-log">
                  <div *ngFor="let log of battleLogs" class="log-entry" 
                       [class.critical]="log.includes('Critical')"
                       [class.super-effective]="log.includes('Super')">
                    {{ log }}
                  </div>
                </div>
              </div>

              <div class="fighter right" [class.attacking]="currentAttacker === selectedPokemon2">
                <img [src]="getPokemonImage(selectedPokemon2!)" [alt]="selectedPokemon2!.name">
                <div class="health-bar">
                  <div class="health-fill" [style.width.%]="(fighter2Health / fighter2MaxHealth) * 100"></div>
                </div>
                <div class="health-text">
                  HP: {{ fighter2Health }}/{{ fighter2MaxHealth }}
                </div>
                <h4>{{ selectedPokemon2!.name | titlecase }}</h4>
              </div>
            </div>
          </div>

          <!-- Battle Results -->
          <div class="battle-results" *ngIf="battleResult">
            <div class="result-announcement">
              <h3>🏆 {{ battleResult.winner.name | titlecase }} {{ 'wins' | translate }}!</h3>
              <div class="winner-showcase">
                <img [src]="getPokemonImage(battleResult.winner)" [alt]="battleResult.winner.name">
              </div>
            </div>

            <div class="battle-summary">
              <h4>{{ 'battleSummary' | translate }}</h4>
              <div class="summary-stats">
                <div class="stat-item">
                  <span>{{ 'totalRounds' | translate }}:</span>
                  <span>{{ battleResult.rounds.length }}</span>
                </div>
                <div class="stat-item">
                  <span>{{ 'totalDamage' | translate }}:</span>
                  <span>{{ battleResult.totalDamage }}</span>
                </div>
                <div class="stat-item">
                  <span>{{ 'battleDuration' | translate }}:</span>
                  <span>{{ getBattleDuration() }}s</span>
                </div>
              </div>
            </div>

            <div class="battle-actions">
              <button class="btn btn-primary" (click)="resetBattle()">
                <i class="fas fa-redo"></i> {{ 'battleAgain' | translate }}
              </button>
              <button class="btn btn-secondary" (click)="close.emit()">
                <i class="fas fa-times"></i> {{ 'close' | translate }}
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
    }

    .battle-simulator {
      max-width: 900px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
      background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 20px 20px 0 0;
      border-bottom: 3px solid #ff6b6b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }



    .audio-btn {
      background: #4ecdc4;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .audio-btn:hover {
      background: #45b7aa;
      transform: scale(1.1);
    }

    .battle-content {
      padding: 30px;
      color: white;
    }

    .battle-setup h3 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .fighters-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 30px;
      align-items: center;
      margin-bottom: 30px;
    }

    .fighter-section {
      text-align: center;
    }

    .fighter-section h4 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .pokemon-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 15px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .pokemon-card.selected {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .pokemon-card img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }

    .pokemon-card h5 {
      margin: 10px 0 5px 0;
      font-size: 1.2rem;
    }

    .pokemon-attacks {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    }

    .pokemon-attacks h6 {
      margin: 0 0 8px 0;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .attack-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }

    .attack-badge {
      background: #4ecdc4;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 600;
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
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    select {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: none;
      background: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
    }

    .start-battle {
      display: block;
      margin: 0 auto;
      padding: 15px 30px;
      font-size: 1.2rem;
      background: linear-gradient(45deg, #ff6b6b, #ff8e53);
      border: none;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .start-battle:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }

    .start-battle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .battle-arena {
      padding: 20px;
    }

    .arena-background {
      background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
      border-radius: 20px;
      padding: 30px;
      position: relative;
      min-height: 400px;
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: center;
      gap: 20px;
    }

    .fighter {
      text-align: center;
      transition: all 0.5s ease;
    }

    .fighter.attacking {
      transform: scale(1.1);
      animation: attack 0.5s ease;
    }

    @keyframes attack {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.2) translateX(10px); }
    }

    .fighter.left.attacking {
      animation: attackLeft 0.5s ease;
    }

    .fighter.right.attacking {
      animation: attackRight 0.5s ease;
    }

    @keyframes attackLeft {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.2) translateX(20px); }
    }

    @keyframes attackRight {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.2) translateX(-20px); }
    }

    .fighter img {
      width: 120px;
      height: 120px;
      margin-bottom: 10px;
    }

    .health-bar {
      width: 100px;
      height: 10px;
      background: #ccc;
      border-radius: 5px;
      overflow: hidden;
      margin: 10px auto;
    }

    .health-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
      transition: width 0.5s ease;
    }

    .health-text {
      font-size: 0.8rem;
      font-weight: bold;
      color: #333;
      margin: 5px 0;
      text-align: center;
    }

    .battle-effects {
      text-align: center;
    }

    .effect-text {
      font-size: 2rem;
      font-weight: bold;
      color: #ff6b6b;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      animation: effectPulse 1s ease;
    }

    @keyframes effectPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    .battle-log {
      background: rgba(0, 0, 0, 0.7);
      border-radius: 10px;
      padding: 15px;
      margin-top: 20px;
      max-height: 150px;
      overflow-y: auto;
    }

    .log-entry {
      padding: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.1);
      animation: fadeIn 0.5s ease;
    }

    .log-entry.critical {
      background: rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      font-weight: bold;
    }

    .log-entry.super-effective {
      background: rgba(78, 205, 196, 0.3);
      color: #4ecdc4;
      font-weight: bold;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .battle-results {
      text-align: center;
    }

    .result-announcement h3 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      animation: celebration 2s ease;
    }

    @keyframes celebration {
      0%, 100% { transform: scale(1); }
      25%, 75% { transform: scale(1.1); }
      50% { transform: scale(1.2); }
    }

    .winner-showcase img {
      width: 150px;
      height: 150px;
      margin: 20px 0;
      border-radius: 50%;
      border: 5px solid gold;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }

    .battle-summary {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      margin: 20px 0;
      backdrop-filter: blur(10px);
    }

    .summary-stats {
      display: grid;
      gap: 10px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    .battle-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
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

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .fighters-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .vs-divider {
        order: -1;
      }

      .arena-background {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto 1fr;
      }

      .battle-effects {
        order: 2;
      }
    }
  `]
})
export class BattleSimulatorModalComponent implements OnInit, OnDestroy {
  @Input() initialPokemon: Pokemon | null = null;
  @Output() close = new EventEmitter<void>();

  userPokedex: Pokemon[] = [];
  selectedPokemon1: Pokemon | null = null;
  selectedPokemon2: Pokemon | null = null;
  selectedPokemon1Id: string = '';
  selectedPokemon2Id: string = '';

  battleInProgress = false;
  battleResult: BattleResult | null = null;
  
  fighter1Health = 100;
  fighter2Health = 100;
  fighter1MaxHealth = 100;
  fighter2MaxHealth = 100;
  currentAttacker: Pokemon | null = null;
  currentEffect = '';
  battleLogs: string[] = [];
  
  pokemon1Attacks: PokemonAttack[] = [];
  pokemon2Attacks: PokemonAttack[] = [];
  
  // Control de audio
  
  private battleStartTime = 0;

  constructor(
    private pokemonService: PokemonService,
  ) {}

  ngOnInit(): void {
    try {
      this.userPokedex = this.pokemonService.getUserPokedex();
      console.log('Pokedex cargado:', this.userPokedex.length, 'Pokémon');
      
      if (this.initialPokemon) {
        this.selectedPokemon1 = this.initialPokemon;
        this.selectedPokemon1Id = this.initialPokemon.id.toString();
        this.fighter1MaxHealth = this.calculateMaxHealth(this.initialPokemon);
        console.log('Pokémon inicial seleccionado:', this.initialPokemon.name, 'HP máximo:', this.fighter1MaxHealth);
        this.loadPokemonAttacks();
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.userPokedex = [];
    }
  }

  ngOnDestroy(): void {
    try {
      console.log('Componente destruido, audio detenido');
    } catch (error) {
      console.error('Error destruyendo componente:', error);
    }
  }

  private loadPokemonAttacks(): void {
    try {
      if (this.selectedPokemon1) {
        this.pokemon1Attacks = getRandomAttacksForPokemon(this.selectedPokemon1, 4);
        console.log('Ataques cargados para Pokémon 1:', this.pokemon1Attacks);
      }
      if (this.selectedPokemon2) {
        this.pokemon2Attacks = getRandomAttacksForPokemon(this.selectedPokemon2, 4);
        console.log('Ataques cargados para Pokémon 2:', this.pokemon2Attacks);
      }
    } catch (error) {
      console.error('Error cargando ataques:', error);
      this.pokemon1Attacks = this.getDefaultAttacks();
      this.pokemon2Attacks = this.getDefaultAttacks();
    }
  }

  private getDefaultAttacks(): PokemonAttack[] {
    return [
      {
        name: 'Tackle',
        type: 'normal',
        power: 40,
        accuracy: 100,
        category: 'physical',
      },
      {
        name: 'Scratch',
        type: 'normal',
        power: 40,
        accuracy: 100,
        category: 'physical',
      }
    ];
  }

  getPokemonImage(pokemon: Pokemon): string {
    try {
      return pokemon.sprites?.other?.['official-artwork']?.front_default || 
             `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    } catch (error) {
      console.error('Error obteniendo imagen del Pokémon:', error);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    }
  }

  getTotalPower(pokemon: Pokemon): number {
    try {
      if (!pokemon.stats) return 0;
      return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
    } catch (error) {
      console.error('Error calculando poder total:', error);
      return 0;
    }
  }

  onPokemonSelect(fighter: number, event: any): void {
    try {
      const pokemonId = parseInt(event.target.value);
      const pokemon = this.userPokedex.find(p => p.id === pokemonId);
      
      if (fighter === 1) {
        this.selectedPokemon1 = pokemon || null;
        if (pokemon) {
          this.pokemon1Attacks = getRandomAttacksForPokemon(pokemon, 4);
          this.fighter1MaxHealth = this.calculateMaxHealth(pokemon);
          console.log('Pokémon 1 seleccionado:', pokemon.name, 'HP máximo:', this.fighter1MaxHealth, 'Ataques:', this.pokemon1Attacks);
        }
      } else {
        this.selectedPokemon2 = pokemon || null;
        if (pokemon) {
          this.pokemon2Attacks = getRandomAttacksForPokemon(pokemon, 4);
          this.fighter2MaxHealth = this.calculateMaxHealth(pokemon);
          console.log('Pokémon 2 seleccionado:', pokemon.name, 'HP máximo:', this.fighter2MaxHealth, 'Ataques:', this.pokemon2Attacks);
        }
      }
    } catch (error) {
      console.error('Error seleccionando Pokémon:', error);
      if (fighter === 1) {
        this.pokemon1Attacks = this.getDefaultAttacks();
        this.fighter1MaxHealth = 100;
      } else {
        this.pokemon2Attacks = this.getDefaultAttacks();
        this.fighter2MaxHealth = 100;
      }
    }
  }

  private calculateMaxHealth(pokemon: Pokemon): number {
    try {
      const baseHP = pokemon.stats?.find(s => s.stat.name === 'hp')?.base_stat || 50;
      const defenseBonus = pokemon.stats?.find(s => s.stat.name === 'defense')?.base_stat || 50;
      const spDefBonus = pokemon.stats?.find(s => s.stat.name === 'special-defense')?.base_stat || 50;
      
      const totalStats = pokemon.stats?.reduce((sum, stat) => sum + stat.base_stat, 0) || 300;
      const level = Math.floor(totalStats / 30) + 1; // Nivel 1-20
      
      const totalHP = Math.floor(baseHP * 1.2) + Math.floor((defenseBonus + spDefBonus) / 6) + (level * 3) + 40;
      return Math.max(60, Math.min(180, totalHP)); // Limitar entre 60 y 180 HP
    } catch (error) {
      console.error('Error calculando HP máximo:', error);
      return 100; // HP por defecto
    }
  }

  startBattle(): void {
    try {
      if (!this.selectedPokemon1 || !this.selectedPokemon2) {
        console.warn('No se pueden seleccionar Pokémon para la batalla');
        return;
      }
      
      this.battleInProgress = true;
      this.battleStartTime = Date.now();
      this.fighter1Health = this.fighter1MaxHealth;
      this.fighter2Health = this.fighter2MaxHealth;
      this.battleLogs = [];
      
      console.log('Batalla iniciada:', {
        pokemon1: this.selectedPokemon1.name,
        pokemon2: this.selectedPokemon2.name,
        hp1: this.fighter1Health,
        hp2: this.fighter2Health,
        hpMax1: this.fighter1MaxHealth,
        hpMax2: this.fighter2MaxHealth
      });
      
      
      this.simulateBattle();
    } catch (error) {
      console.error('Error iniciando batalla:', error);
      this.battleInProgress = false;
    }
  }

  private async simulateBattle(): Promise<void> {
    try {
      const rounds: BattleRound[] = [];
      let attacker = this.selectedPokemon1!;
      let defender = this.selectedPokemon2!;
      
      console.log('Simulando batalla entre:', attacker.name, 'vs', defender.name);
      
      while (this.fighter1Health > 0 && this.fighter2Health > 0) {
        await this.delay(1500);
        
        const round = this.executeAttack(attacker, defender);
        rounds.push(round);
        
        this.currentAttacker = attacker;
        this.showEffect(round);
        
        if (attacker === this.selectedPokemon1) {
          this.fighter2Health = Math.max(0, this.fighter2Health - round.damage);
        } else {
          this.fighter1Health = Math.max(0, this.fighter1Health - round.damage);
        }
        
        console.log(`Ronda: ${attacker.name} ataca a ${defender.name}, Daño: ${round.damage}`);
        console.log(`HP restante: ${this.selectedPokemon1?.name}: ${this.fighter1Health}/${this.fighter1MaxHealth}, ${this.selectedPokemon2?.name}: ${this.fighter2Health}/${this.fighter2MaxHealth}`);
        
        await this.delay(1000);
        
        // Switch attacker and defender
        [attacker, defender] = [defender, attacker];
      }
      
      const winner = this.fighter1Health > 0 ? this.selectedPokemon1! : this.selectedPokemon2!;
      const loser = this.fighter1Health > 0 ? this.selectedPokemon2! : this.selectedPokemon1!;
      
      this.battleResult = {
        winner,
        loser,
        rounds,
        totalDamage: rounds.reduce((total, round) => total + round.damage, 0)
      };
      
      console.log('Batalla terminada. Ganador:', winner.name);
      this.battleInProgress = false;
      
    } catch (error) {
      console.error('Error simulando batalla:', error);
      this.battleInProgress = false;
    }
  }

  private executeAttack(attacker: Pokemon, defender: Pokemon): BattleRound {
    const attacks = attacker === this.selectedPokemon1 ? this.pokemon1Attacks : this.pokemon2Attacks;
    
    if (!attacks || attacks.length === 0) {
      const defaultAttack: PokemonAttack = {
        name: 'Struggle',
        type: 'normal',
        power: 50,
        accuracy: 100,
        category: 'physical',
      };
      
      return this.calculateDamage(attacker, defender, defaultAttack);
    }
    
    const selectedAttack = attacks[Math.floor(Math.random() * attacks.length)];
    return this.calculateDamage(attacker, defender, selectedAttack);
  }

  private calculateDamage(attacker: Pokemon, defender: Pokemon, selectedAttack: PokemonAttack): BattleRound {
    try {
      const attackStat = attacker.stats?.find(s => s.stat.name === 'attack')?.base_stat || 50;
      const defenseStat = defender.stats?.find(s => s.stat.name === 'defense')?.base_stat || 50;
      
      const attackerTotalStats = attacker.stats?.reduce((sum, stat) => sum + stat.base_stat, 0) || 300;
      const attackerLevel = Math.floor(attackerTotalStats / 30) + 1;
      
      let baseDamage = selectedAttack.power;
      if (selectedAttack.category === 'physical') {
        baseDamage = Math.max(8, Math.floor(((attackStat + attackerLevel * 2) * selectedAttack.power / 100) * (100 / (100 + defenseStat * 0.6))));
      } else if (selectedAttack.category === 'special') {
        const spAtk = attacker.stats?.find(s => s.stat.name === 'special-attack')?.base_stat || 50;
        const spDef = defender.stats?.find(s => s.stat.name === 'special-defense')?.base_stat || 50;
        baseDamage = Math.max(8, Math.floor(((spAtk + attackerLevel * 2) * selectedAttack.power / 100) * (100 / (100 + spDef * 0.6))));
      }
      
      const critical = Math.random() < 0.08;
      const effectivenessMultiplier = this.getTypeEffectiveness(attacker, defender);
      
      let damage = baseDamage * (critical ? 1.3 : 1) * effectivenessMultiplier;
      damage = Math.round(damage + (Math.random() * 6 - 3));
      damage = Math.max(3, damage);
      
      let effectiveness = 'normal';
      if (effectivenessMultiplier > 1) effectiveness = 'super-effective';
      if (effectivenessMultiplier < 1) effectiveness = 'not-very-effective';
      
      // Reproducir sonido del ataque
      
      return { 
        attacker, 
        defender, 
        damage, 
        critical, 
        effectiveness,
        attack: selectedAttack,
        attackName: selectedAttack.name
      };
    } catch (error) {
      console.error('Error calculando daño:', error);
      // Retornar ataque por defecto en caso de error
      return {
        attacker,
        defender,
        damage: 10,
        critical: false,
        effectiveness: 'normal',
        attack: selectedAttack,
        attackName: selectedAttack.name
      };
    }
  }

  private getTypeEffectiveness(attacker: Pokemon, defender: Pokemon): number {
    try {
      // Simplified type effectiveness system
      const attackerTypes = attacker.types?.map(t => t.type.name) || [];
      const defenderTypes = defender.types?.map(t => t.type.name) || [];
      
      const strongAgainst: { [key: string]: string[] } = {
        fire: ['grass', 'ice', 'bug'],
        water: ['fire', 'ground', 'rock'],
        grass: ['water', 'ground', 'rock'],
        electric: ['water', 'flying'],
        ice: ['grass', 'ground', 'flying', 'dragon'],
        fighting: ['normal', 'rock', 'steel', 'ice', 'dark'],
        poison: ['grass', 'fairy'],
        ground: ['poison', 'rock', 'steel', 'fire', 'electric'],
        flying: ['fighting', 'bug', 'grass'],
        psychic: ['fighting', 'poison'],
        bug: ['grass', 'psychic', 'dark'],
        rock: ['flying', 'bug', 'fire', 'ice'],
        ghost: ['ghost', 'psychic'],
        dragon: ['dragon'],
        dark: ['ghost', 'psychic'],
        steel: ['rock', 'ice', 'fairy'],
        fairy: ['fighting', 'dragon', 'dark']
      };

      const weakAgainst: { [key: string]: string[] } = {
        fire: ['water', 'rock', 'dragon'],
        water: ['grass', 'dragon'],
        grass: ['fire', 'poison', 'flying', 'bug', 'dragon', 'steel'],
        electric: ['grass', 'dragon'],
        ice: ['fire', 'water', 'steel'],
        fighting: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
        poison: ['poison', 'ground', 'rock', 'ghost', 'steel'],
        ground: ['grass', 'bug'],
        flying: ['electric', 'rock', 'steel'],
        psychic: ['steel', 'psychic'],
        bug: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
        rock: ['fighting', 'ground', 'steel'],
        ghost: ['dark'],
        dragon: ['steel'],
        dark: ['fighting', 'dark', 'fairy'],
        steel: ['fire', 'water', 'electric', 'steel'],
        fairy: ['poison', 'steel']
      };
      
      let multiplier = 1;
      
      for (const attackType of attackerTypes) {
        for (const defenseType of defenderTypes) {
          if (strongAgainst[attackType]?.includes(defenseType)) {
            multiplier *= 1.5;
          } else if (weakAgainst[attackType]?.includes(defenseType)) {
            multiplier *= 0.7; // Poco efectivo: 0.7x
          }
        }
      }
      
      return Math.max(0.5, Math.min(1.5, multiplier)); // Limitar entre 0.5x y 1.5x
    } catch (error) {
      console.error('Error calculando efectividad de tipo:', error);
      return 1; // Efectividad normal por defecto
    }
  }

  private showEffect(round: BattleRound): void {
    try {
      let effect = `${round.attacker.name} used ${round.attackName}!`;
      
      if (round.critical) {
        effect = `Critical Hit! ${effect}`;
      }
      
      if (round.effectiveness === 'super-effective') {
        effect += ' It\'s super effective!';
      } else if (round.effectiveness === 'not-very-effective') {
        effect += ' It\'s not very effective...';
      }
      
      this.currentEffect = effect;
      this.battleLogs.unshift(`${effect} (${round.damage} damage)`);
      
      if (this.battleLogs.length > 8) {
        this.battleLogs = this.battleLogs.slice(0, 8);
      }
      
      console.log('Efecto mostrado:', effect);
    } catch (error) {
      console.error('Error mostrando efecto:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    try {
      return new Promise(resolve => setTimeout(resolve, ms));
    } catch (error) {
      console.error('Error en delay:', error);
      return Promise.resolve();
    }
  }

  getBattleDuration(): number {
    try {
      return Math.round((Date.now() - this.battleStartTime) / 1000);
    } catch (error) {
      console.error('Error calculando duración de batalla:', error);
      return 0;
    }
  }

  getBattleStatus(): any {
    return {
      pokemon1: {
        name: this.selectedPokemon1?.name || 'No seleccionado',
        currentHP: this.fighter1Health,
        maxHP: this.fighter1MaxHealth,
        percentage: this.fighter1MaxHealth > 0 ? Math.round((this.fighter1Health / this.fighter1MaxHealth) * 100) : 0
      },
      pokemon2: {
        name: this.selectedPokemon2?.name || 'No seleccionado',
        currentHP: this.fighter2Health,
        maxHP: this.fighter2MaxHealth,
        percentage: this.fighter2MaxHealth > 0 ? Math.round((this.fighter2Health / this.fighter2MaxHealth) * 100) : 0
      }
    };
  }

  resetBattle(): void {
    try {
      this.battleInProgress = false;
      this.battleResult = null;
      this.fighter1Health = this.fighter1MaxHealth;
      this.fighter2Health = this.fighter2MaxHealth;
      this.currentAttacker = null;
      this.currentEffect = '';
      this.battleLogs = [];
      
      
      console.log('Batalla reseteada');
      console.log('Estado del HP:', this.getBattleStatus());
    } catch (error) {
      console.error('Error reseteando batalla:', error);
    }
  }



}