import {Component, inject} from '@angular/core';
import {DecimalPipe, PercentPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {CreditSimulationStore} from '../../../application/credit-simulation.store';
import {ClientStore} from '../../../../client-management/application/client.store';
import {VehicleStore} from '../../../../vehicle-management/application/vehicle.store';
import {PeriodType} from '../../../domain/model/credit-simulation.types';
import {PaymentScheduleEntry} from '../../../domain/model/payment-schedule-entry.entity';

/** Read-only detail screen for a saved "Compra Inteligente" simulation: KPIs and cronograma. */
@Component({
  selector: 'app-simulation-detail',
  imports: [RouterLink, TranslatePipe, MatButtonModule, MatIconModule, MatCardModule, DecimalPipe, PercentPipe],
  templateUrl: './simulation-detail.html',
  styleUrl: './simulation-detail.css'
})
export class SimulationDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(CreditSimulationStore);
  private readonly clientStore = inject(ClientStore);
  private readonly vehicleStore = inject(VehicleStore);

  protected readonly simulationId = this.route.snapshot.paramMap.get('id')!;
  protected readonly simulation = this.store.getSimulationById(this.simulationId);
  protected readonly schedule = this.store.getScheduleBySimulationId(this.simulationId);

  clientName(clientId: string): string {
    return this.clientStore.clients().find(client => client.id === clientId)?.fullName ?? '';
  }

  vehicleName(vehicleId: string): string {
    return this.vehicleStore.vehicles().find(vehicle => vehicle.id === vehicleId)?.displayName ?? '';
  }

  vehicleImageUrl(vehicleId: string): string | null {
    return this.vehicleStore.vehicles().find(vehicle => vehicle.id === vehicleId)?.primaryImage?.url ?? null;
  }

  totalInterest(): number {
    return this.schedule().reduce((total, entry) => total + entry.interest, 0);
  }

  totalInsurance(): number {
    return this.schedule().reduce((total, entry) => total + entry.totalInsurance, 0);
  }

  totalPortes(): number {
    return this.schedule().reduce((total, entry) => total + entry.portes, 0);
  }

  vanLabelKey(van: number): string {
    return van >= 0 ? 'simulation.positive-value' : 'simulation.negative-value';
  }

  capitalLinePoints(): string {
    return this.chartPoints(this.schedule(), entry => entry.finalBalance);
  }

  interestLinePoints(): string {
    return this.chartPoints(this.schedule(), entry => entry.interest);
  }

  exportPdf(): void {
    window.print();
  }

  private chartPoints(entries: PaymentScheduleEntry[], selector: (entry: PaymentScheduleEntry) => number): string {
    if (entries.length === 0) {
      return '';
    }
    const width = 560;
    const height = 160;
    const left = 20;
    const top = 20;
    const values = entries.map(selector);
    const max = Math.max(...values, 1);
    const lastIndex = Math.max(entries.length - 1, 1);
    return values.map((value, index) => {
      const x = left + (index / lastIndex) * width;
      const y = top + height - (value / max) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  periodLabelKey(periodType: PeriodType): string {
    switch (periodType) {
      case 'GRACIA_PARCIAL':
        return 'simulation.period-gracia-parcial';
      case 'GRACIA_TOTAL':
        return 'simulation.period-gracia-total';
      default:
        return 'simulation.period-normal';
    }
  }
}
