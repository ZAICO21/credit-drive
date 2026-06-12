import {DecimalPipe, PercentPipe} from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ClientStore} from '../../../../client-management/application/client.store';
import {CreditSimulationStore} from '../../../../credit-simulation/application/credit-simulation.store';
import {VehicleStore} from '../../../../vehicle-management/application/vehicle.store';

interface Kpi {
  label: string;
  help: string;
  icon: string;
  value: number;
  format: 'integer' | 'decimal' | 'percent';
}

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    TranslatePipe,
    DecimalPipe,
    PercentPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  protected readonly monthlyGoal = 3000000;
  private readonly simulationStore = inject(CreditSimulationStore);
  private readonly clientStore = inject(ClientStore);
  private readonly vehicleStore = inject(VehicleStore);

  protected readonly kpis = computed<Kpi[]>(() => [
    {
      label: 'dashboard.kpi.simulations',
      help: 'dashboard.kpi.simulations-help',
      icon: 'insert_chart',
      value: this.monthlySimulationsCount(),
      format: 'integer'
    },
    {
      label: 'dashboard.kpi.clients',
      help: 'dashboard.kpi.clients-help',
      icon: 'groups',
      value: this.clientStore.clientsCount(),
      format: 'integer'
    },
    {
      label: 'dashboard.kpi.financed',
      help: 'dashboard.kpi.financed-help',
      icon: 'paid',
      value: this.totalFinanced(),
      format: 'decimal'
    },
    {
      label: 'dashboard.kpi.rate',
      help: 'dashboard.kpi.rate-help',
      icon: 'percent',
      value: this.averageTcea(),
      format: 'percent'
    }
  ]);

  protected readonly recentSimulations = computed(() =>
    [...this.simulationStore.simulations()]
      .sort((a, b) => b.registrationDate.localeCompare(a.registrationDate))
      .slice(0, 5)
  );

  clientName(clientId: string): string {
    return this.clientStore.clients().find(client => client.id === clientId)?.fullName ?? '-';
  }

  vehicleName(vehicleId: string): string {
    return this.vehicleStore.vehicles().find(vehicle => vehicle.id === vehicleId)?.displayName ?? '-';
  }

  goalProgress(): number {
    return Math.min(this.totalFinanced() / this.monthlyGoal, 1);
  }

  goalProgressPercent(): number {
    return Math.round(this.goalProgress() * 100);
  }

  goalRemaining(): number {
    return Math.max(this.monthlyGoal - this.totalFinanced(), 0);
  }

  private monthlySimulationsCount(): number {
    const now = new Date();
    return this.simulationStore.simulations().filter(simulation => {
      const date = new Date(`${simulation.registrationDate}T00:00:00`);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
  }

  private totalFinanced(): number {
    return this.simulationStore.simulations()
      .reduce((total, simulation) => total + simulation.financedAmount, 0);
  }

  private averageTcea(): number {
    const simulations = this.simulationStore.simulations();
    if (simulations.length === 0) {
      return 0;
    }
    return simulations.reduce((total, simulation) => total + simulation.tcea, 0) / simulations.length;
  }
}
