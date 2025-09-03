import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';

/**
 * Demo component showcasing PrimeNG integration
 * This demonstrates how to use PrimeNG components in the application
 */
@Component({
  selector: 'app-prime-demo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    ToastModule,
    TagModule,
    AvatarModule,
    ChipModule
  ],
  providers: [MessageService],
  template: `
    <!-- PrimeNG Integration Demo -->
    <div class="prime-demo-container">
      <h2>🚀 PrimeNG 17.3.0 Integration</h2>
      
      <!-- Demo Cards -->
      <div class="demo-grid">
        
        <!-- Pokemon Stats Card -->
        <p-card header="Pokemon Stats" subheader="Powered by PrimeNG">
          <ng-template pTemplate="content">
            <div class="stat-items">
              <div class="stat-item">
                <span class="stat-label">HP</span>
                <p-progressBar [value]="75" [showValue]="true"></p-progressBar>
              </div>
              <div class="stat-item">
                <span class="stat-label">Attack</span>
                <p-progressBar [value]="90" [showValue]="true"></p-progressBar>
              </div>
              <div class="stat-item">
                <span class="stat-label">Defense</span>
                <p-progressBar [value]="60" [showValue]="true"></p-progressBar>
              </div>
            </div>
          </ng-template>
        </p-card>

        <!-- Pokemon Types Card -->
        <p-card header="Pokemon Types" subheader="Type effectiveness">
          <ng-template pTemplate="content">
            <div class="types-demo">
              <p-tag value="Fire" severity="danger" icon="pi pi-sun"></p-tag>
              <p-tag value="Water" severity="info" icon="pi pi-moon"></p-tag>
              <p-tag value="Grass" severity="success" icon="pi pi-leaf"></p-tag>
              <p-tag value="Electric" severity="warning" icon="pi pi-bolt"></p-tag>
            </div>
          </ng-template>
        </p-card>

        <!-- Team Management Card -->
        <p-card header="Team Management" subheader="Manage your Pokemon team">
          <ng-template pTemplate="content">
            <div class="team-demo">
              <div class="team-member">
                <p-avatar 
                  image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" 
                  size="large">
                </p-avatar>
                <p-chip label="Bulbasaur" removable="true"></p-chip>
              </div>
              <div class="team-member">
                <p-avatar 
                  image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" 
                  size="large">
                </p-avatar>
                <p-chip label="Charmander" removable="true"></p-chip>
              </div>
            </div>
          </ng-template>
        </p-card>

        <!-- Action Buttons Card -->
        <p-card header="Actions" subheader="PrimeNG Button variants">
          <ng-template pTemplate="content">
            <div class="buttons-demo">
              <p-button 
                label="Capture Pokemon" 
                icon="pi pi-plus" 
                (onClick)="showSuccess()">
              </p-button>
              
              <p-button 
                label="Battle" 
                icon="pi pi-bolt" 
                severity="warning"
                (onClick)="showInfo()">
              </p-button>
              
              <p-button 
                label="Release" 
                icon="pi pi-times" 
                severity="danger"
                (onClick)="showWarn()">
              </p-button>
            </div>
          </ng-template>
        </p-card>

      </div>
    </div>

    <!-- Toast notifications -->
    <p-toast></p-toast>
  `,
  styles: [`
    .prime-demo-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 2rem;
      font-weight: bold;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .stat-items {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-label {
      min-width: 70px;
      font-weight: 500;
    }

    .types-demo {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .team-demo {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .team-member {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .buttons-demo {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .buttons-demo p-button {
      width: 100%;
    }

    /* Override PrimeNG card styles for Pokemon theme */
    :host ::ng-deep .p-card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }

    :host ::ng-deep .p-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: bold;
    }

    :host ::ng-deep .p-progressbar {
      border-radius: 8px;
      height: 12px;
    }

    :host ::ng-deep .p-progressbar .p-progressbar-value {
      background: linear-gradient(45deg, #667eea, #764ba2);
    }

    :host ::ng-deep .p-button {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .p-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class PrimeDemoComponent {

  constructor(private messageService: MessageService) {}

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Pokemon Captured!',
      detail: 'Pikachu has been added to your Pokédex'
    });
  }

  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Battle Started!',
      detail: 'Your Pokemon is ready to battle'
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Pokemon Released',
      detail: 'Pokemon has been released to the wild'
    });
  }
}