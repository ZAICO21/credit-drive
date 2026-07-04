import {Routes} from '@angular/router';
import {Layout} from './shared/presentation/components/layout/layout';
import {iamGuard} from './iam/infrastructure/iam.guard';

const dashboard = () => import('./shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);
const home = () => import('./shared/presentation/views/home/home').then(m => m.Home);
const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const settings = () => import('./iam/presentation/views/settings/settings').then(m => m.Settings);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

const iamRoutes = () => import('./iam/presentation/iam.routes').then(m => m.iamRoutes);

const clientRoutes = () => import('./client-management/presentation/client.routes').then(m => m.clientRoutes);
const vehicleRoutes = () => import('./vehicle-management/presentation/vehicle.routes').then(m => m.vehicleRoutes);

const simulatorRoutes = () => import('./credit-simulation/presentation/simulation.routes').then(m => m.simulatorRoutes);
const simulationsRoutes = () =>
  import('./credit-simulation/presentation/simulation.routes').then((m) => m.simulationsRoutes);

const help = () => import('./shared/presentation/views/help/help').then((m) => m.Help);
const guide = () => import('./shared/presentation/views/guide/guide').then((m) => m.Guide);

const baseTitle = 'Compra Inteligente';

/**
 * Root route configuration.
 *
 * @remarks
 * `iam` (sign-in) is rendered standalone, outside the {@link Layout} shell —
 * it has no sidenav. Every other route is a child of the shell route, which
 * is guarded by {@link iamGuard}: unauthenticated users are redirected to
 * `/iam/sign-in` before any child route (including `**`) activates.
 */
export const routes: Routes = [
  { path: 'iam', loadChildren: iamRoutes },

  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'dashboard', loadComponent: dashboard, title: `${baseTitle} - Dashboard` },
      { path: 'home', loadComponent: home, title: `${baseTitle} - Inicio` },
      { path: 'about', loadComponent: about, title: `${baseTitle} - Acerca de` },

      { path: 'clients', loadChildren: clientRoutes },
      { path: 'vehicles', loadChildren: vehicleRoutes },
      { path: 'simulator', loadChildren: simulatorRoutes },
      { path: 'simulations', loadChildren: simulationsRoutes },
      { path: 'help', loadComponent: help, title: `${baseTitle} - Ayuda` },
      { path: 'guide', loadComponent: guide, title: `${baseTitle} - Guía de uso` },
      { path: 'settings', loadComponent: settings, title: `${baseTitle} - Configuración` },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - No encontrado` },
    ],
  },
];
