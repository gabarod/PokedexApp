import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-new-team-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Crear Nuevo Equipo</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <form [formGroup]="teamForm" (ngSubmit)="onSubmit()" class="team-form">
          <div class="form-group">
            <label for="name">Nombre del Equipo</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name"
              [class.error]="teamForm.get('name')?.invalid && teamForm.get('name')?.touched"
              placeholder="Ingresa el nombre de tu equipo"
            >
            <div class="error-message" *ngIf="teamForm.get('name')?.invalid && teamForm.get('name')?.touched">
              <span *ngIf="teamForm.get('name')?.errors?.['required']">El nombre del equipo es obligatorio</span>
            </div>
          </div>

          <div class="form-group">
            <label for="limit">Límite de Pokémon</label>
            <input 
              type="number" 
              id="limit" 
              formControlName="limit"
              [class.error]="teamForm.get('limit')?.invalid && teamForm.get('limit')?.touched"
              placeholder="Máximo número de Pokémon"
              min="1"
              max="20"
            >
            <div class="error-message" *ngIf="teamForm.get('limit')?.invalid && teamForm.get('limit')?.touched">
              <span *ngIf="teamForm.get('limit')?.errors?.['required']">El límite es obligatorio</span>
              <span *ngIf="teamForm.get('limit')?.errors?.['min']">El límite debe ser mayor a 0</span>
              <span *ngIf="teamForm.get('limit')?.errors?.['max']">El límite no puede ser mayor a 20</span>
            </div>
            <div class="form-help">
              Recomendado: 6 Pokémon (estándar de los juegos)
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="close.emit()">
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="teamForm.invalid || loading"
            >
              <span *ngIf="!loading">Crear Equipo</span>
              <span *ngIf="loading">Creando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .team-form {
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-help {
        font-size: 0.8rem;
        color: #6b7280;
        margin-top: 4px;
        font-style: italic;
      }
      
      .form-actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 32px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
      }
    }

    input[type="number"] {
      width: 100%;
    }

    @media (max-width: 480px) {
      .form-actions {
        flex-direction: column;
        
        .btn {
          width: 100%;
        }
      }
    }
  `]
})
export class NewTeamModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() teamCreated = new EventEmitter<void>();

  teamForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private pokemonService: PokemonService
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      limit: [6, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  onSubmit(): void {
    if (this.teamForm.valid && !this.loading) {
      this.loading = true;

      const { name, limit } = this.teamForm.value;
      this.pokemonService.createTeam(name, limit);
      
      setTimeout(() => {
        this.loading = false;
        this.teamCreated.emit();
        this.close.emit();
      }, 500);
    }
  }
}