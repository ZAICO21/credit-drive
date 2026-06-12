import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

interface NavOption {
  link: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  readonly options = signal<NavOption[]>([
    {link: '/dashboard', label: 'sidebar.dashboard', icon: 'dashboard'},
    {link: '/clients', label: 'sidebar.clients', icon: 'groups'},
    {link: '/vehicles', label: 'sidebar.vehicles', icon: 'directions_car'},
    {link: '/simulator', label: 'sidebar.simulator', icon: 'calculate'},
    {link: '/simulations', label: 'sidebar.simulations', icon: 'insert_chart'}
  ]);
}
