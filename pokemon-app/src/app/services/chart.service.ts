import { Injectable, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private charts: Map<string, Chart> = new Map();

  constructor() {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  /**
   * Create a Pokemon stats chart
   */
  createStatsChart(canvas: ElementRef<HTMLCanvasElement>, pokemon: any): Chart {
    const chartId = `stats-${pokemon.id}`;
    
    // Destroy existing chart if it exists
    if (this.charts.has(chartId)) {
      this.charts.get(chartId)?.destroy();
    }

    const config: ChartConfiguration = {
      type: 'radar' as ChartType,
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
        datasets: [{
          label: pokemon.name,
          data: pokemon.stats?.map((stat: any) => stat.base_stat) || [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#1e40af',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 200,
            ticks: {
              stepSize: 40
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: `${pokemon.name} Stats`,
            color: '#111827',
            font: {
              size: 18,
              weight: 'bold'
            }
          }
        }
      }
    };

    const chart = new Chart(canvas.nativeElement, config);
    this.charts.set(chartId, chart);
    
    return chart;
  }

  /**
   * Create a comparison chart between two Pokemon
   */
  createComparisonChart(canvas: ElementRef<HTMLCanvasElement>, pokemon1: any, pokemon2: any): Chart {
    const chartId = `comparison-${pokemon1.id}-${pokemon2.id}`;
    
    if (this.charts.has(chartId)) {
      this.charts.get(chartId)?.destroy();
    }

    const config: ChartConfiguration = {
      type: 'radar' as ChartType,
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
        datasets: [
          {
            label: pokemon1.name,
            data: pokemon1.stats?.map((stat: any) => stat.base_stat) || [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 2
          },
          {
            label: pokemon2.name,
            data: pokemon2.stats?.map((stat: any) => stat.base_stat) || [],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 200
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Pokemon Comparison',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    };

    const chart = new Chart(canvas.nativeElement, config);
    this.charts.set(chartId, chart);
    
    return chart;
  }

  /**
   * Create a team stats overview chart
   */
  createTeamChart(canvas: ElementRef<HTMLCanvasElement>, team: any[]): Chart {
    const chartId = `team-${Date.now()}`;
    
    if (this.charts.has(chartId)) {
      this.charts.get(chartId)?.destroy();
    }

    // Calculate average stats for the team
    const avgStats = [0, 0, 0, 0, 0, 0]; // HP, Attack, Defense, Sp.Attack, Sp.Defense, Speed
    
    team.forEach(pokemon => {
      if (pokemon.stats) {
        pokemon.stats.forEach((stat: any, index: number) => {
          avgStats[index] += stat.base_stat;
        });
      }
    });

    // Calculate averages
    avgStats.forEach((stat, index) => {
      avgStats[index] = Math.round(stat / team.length);
    });

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
        datasets: [{
          label: 'Team Average',
          data: avgStats,
          backgroundColor: [
            '#f87171', // HP - Red
            '#fb923c', // Attack - Orange  
            '#fbbf24', // Defense - Yellow
            '#34d399', // Sp. Attack - Green
            '#60a5fa', // Sp. Defense - Blue
            '#a78bfa'  // Speed - Purple
          ],
          borderColor: [
            '#dc2626',
            '#ea580c',
            '#d97706',
            '#059669',
            '#2563eb',
            '#7c3aed'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 200
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Team Statistics Overview',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    };

    const chart = new Chart(canvas.nativeElement, config);
    this.charts.set(chartId, chart);
    
    return chart;
  }

  /**
   * Destroy a specific chart
   */
  destroyChart(chartId: string): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.destroy();
      this.charts.delete(chartId);
    }
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }
}