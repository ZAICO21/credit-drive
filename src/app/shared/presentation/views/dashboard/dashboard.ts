import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

interface Kpi {
  label: string;
  help: string;
  icon: string;
  value: string;
  delta: string;
}

interface RecentSimulation {
  client: string;
  vehicle: string;
  amount: string;
  status: string;
  statusTone: 'warning' | 'success' | 'neutral';
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, TranslatePipe, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})


export class Dashboard {

}
